import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/svg_body_parser.dart';

class BodyHighlighter extends StatefulWidget {
  final String svgPath;
  final Set<String> selectedParts;
  final Function(Set<String>) onChanged;

  const BodyHighlighter({
    super.key,
    required this.svgPath,
    required this.selectedParts,
    required this.onChanged,
  });

  @override
  State<BodyHighlighter> createState() => _BodyHighlighterState();
}

class _BodyHighlighterState extends State<BodyHighlighter> {
  final SvgBodyParser _parser = SvgBodyParser();
  List<BodyPart>? _parts;
  Rect? _drawableBounds;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSvg();
  }

  @override
  void didUpdateWidget(covariant BodyHighlighter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.svgPath != widget.svgPath) {
      _loadSvg();
    }
  }

  Future<void> _loadSvg() async {
    setState(() => _isLoading = true);
    try {
      final parts = await _parser.loadAndParseSvg(widget.svgPath);
      
      // Calculate total bounds
      Rect? totalBounds;
      for (final part in parts) {
        final bounds = part.path.getBounds();
        if (totalBounds == null) {
          totalBounds = bounds;
        } else {
          totalBounds = totalBounds.expandToInclude(bounds);
        }
      }

      if (mounted) {
        setState(() {
          _parts = parts;
          _drawableBounds = totalBounds;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error loading SVG: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  /// Calculates the transform matrix to fit content into the container (BoxFit.contain)
  Matrix4 _calculateTransform(Size containerSize) {
    if (_drawableBounds == null) return Matrix4.identity();

    final contentWidth = _drawableBounds!.width;
    final contentHeight = _drawableBounds!.height;
    
    // Add some padding
    final paddedContentWidth = contentWidth * 1.1; // 10% padding
    final paddedContentHeight = contentHeight * 1.1;

    final scaleX = containerSize.width / paddedContentWidth;
    final scaleY = containerSize.height / paddedContentHeight;
    final scale = scaleX < scaleY ? scaleX : scaleY;

    final matrix = Matrix4.identity();
    
    // 1. Center the content around (0,0) based on its bounds center
    matrix.translate(
      containerSize.width / 2,
      containerSize.height / 2,
    );
    
    // 2. Scale
    matrix.scale(scale, scale);
    
    // 3. Translate back by the bounds center
    matrix.translate(
      -_drawableBounds!.center.dx,
      -_drawableBounds!.center.dy,
    );

    return matrix;
  }

  void _handleTap(TapUpDetails details, BuildContext context) {
    if (_parts == null || _drawableBounds == null) return;

    final RenderBox box = context.findRenderObject() as RenderBox;
    final localPosition = box.globalToLocal(details.globalPosition);
    final size = box.size;

    final transform = _calculateTransform(size);
    // Invert the transform to convert screen point to path coordinate space
    final invertedMatrix = Matrix4.copy(transform)..invert();
    final pointInPathSpace = MatrixUtils.transformPoint(invertedMatrix, localPosition);

    // Check hit
    for (final part in _parts!) {
      if (part.path.contains(pointInPathSpace)) {
        final newSelection = Set<String>.from(widget.selectedParts);
        
        // Group logic is implicit: typically all parts of a group have same ID in SVG or 
        // in our parser we handle them. Our current parser puts 'id' as slug.
        // If the SVG has multiple paths with SAME id (slug), our parser separates them? 
        // No, current parser creates one BodyPart per path element.
        // Wait, the generated SVG reused IDs. 
        // Ah, SVGs with duplicate IDs are technically invalid widely, but our parser list logic handles them as separate entries.
        // If we want to toggle ALL with that ID, we do so by ID.
        
        if (newSelection.contains(part.id)) {
          newSelection.remove(part.id);
        } else {
          newSelection.add(part.id);
        }
        widget.onChanged(newSelection);
        break; // Stop after first valid hit (top-most z-index usually)
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.red600));
    }

    if (_parts == null || _parts!.isEmpty) {
      return const Center(child: Text('Failed to load body map'));
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        return GestureDetector(
          onTapUp: (details) => _handleTap(details, context),
          child: CustomPaint(
            size: Size(constraints.maxWidth, constraints.maxHeight),
            painter: BodyPainter(
              parts: _parts!,
              selectedIds: widget.selectedParts,
              transform: _calculateTransform(Size(constraints.maxWidth, constraints.maxHeight)),
            ),
          ),
        );
      },
    );
  }
}

class BodyPainter extends CustomPainter {
  final List<BodyPart> parts;
  final Set<String> selectedIds;
  final Matrix4 transform;

  BodyPainter({
    required this.parts,
    required this.selectedIds,
    required this.transform,
  });

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.transform(transform.storage);

    final Paint defaultPaint = Paint()
      ..color = const Color(0xFFE0E0E0)
      ..style = PaintingStyle.fill;

    final Paint selectedPaint = Paint()
      ..color = AppColors.red600 // Use app red
      ..style = PaintingStyle.fill;
      
    final Paint strokePaint = Paint()
      ..color = const Color(0xFF18181b) // Dark zinc for separation
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    for (final part in parts) {
      final isSelected = selectedIds.contains(part.id);
      
      canvas.drawPath(part.path, isSelected ? selectedPaint : defaultPaint);
      canvas.drawPath(part.path, strokePaint);
    }
    
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant BodyPainter oldDelegate) {
    return oldDelegate.selectedIds != selectedIds || 
           oldDelegate.parts != parts ||
           oldDelegate.transform != transform;
  }
}
