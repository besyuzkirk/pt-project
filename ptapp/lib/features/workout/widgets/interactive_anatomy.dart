import 'package:flutter/material.dart'; 
import 'package:ptapp/core/theme/app_colors.dart';

// Simplified Paths for demo purposes (real SVG parsing would be ideal but complex for this single-file demo)
// I will simulate the SVG paths using basic shapes and positions to represent the 'medical grade' look
// In a real production app, we would use flutter_svg or CustomPainter with Path parsing.
// For this 'Wow' demo, I will use a clever stacking of CustomPainters to mimic the muscle groups.

class MuscleGroup {
  final String id;
  final String name;
  final Path path;
  bool isSelected;

  MuscleGroup({required this.id, required this.name, required this.path, this.isSelected = false});
}

class InteractiveAnatomy extends StatefulWidget {
  final bool isBackView;
  final Function(String)? onMuscleSelected;
  final bool isReadOnly;
  final Set<String> initialSelectedMuscles;

  const InteractiveAnatomy({
    super.key, 
    required this.isBackView, 
    this.onMuscleSelected,
    this.isReadOnly = false,
    this.initialSelectedMuscles = const {},
  });

  @override
  State<InteractiveAnatomy> createState() => _InteractiveAnatomyState();
}

class _InteractiveAnatomyState extends State<InteractiveAnatomy> {
  // We'll define paths in init state
  List<MuscleGroup> muscles = [];

  @override
  void initState() {
    super.initState();
    _initializeMuscles();
  }

  @override
  void didUpdateWidget(covariant InteractiveAnatomy oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.isBackView != widget.isBackView) {
      _initializeMuscles();
    }
  }

  void _initializeMuscles() {
    // This is where "Medical Grade" detail comes in. 
    // Creating simplified paths that look like the design SVG.
    muscles = widget.isBackView ? _getBackMuscles() : _getFrontMuscles();
    
    // Apply initial selections if in read-only mode
    if (widget.initialSelectedMuscles.isNotEmpty) {
      for (var muscle in muscles) {
        if (widget.initialSelectedMuscles.contains(muscle.name) || 
            widget.initialSelectedMuscles.contains(muscle.id)) {
          muscle.isSelected = true;
        }
      }
    }
  }

  List<MuscleGroup> _getFrontMuscles() {
    // Relative coordinates 0-200 width, 0-400 height
    return [
       MuscleGroup(id: 'chest_left', name: 'Göğüs', path: _createPath((p) {
        p.moveTo(100, 85); p.lineTo(75, 88); 
        p.quadraticBezierTo(68, 95, 65, 115);
        p.quadraticBezierTo(75, 130, 100, 125);
        p.close();
      })),
      MuscleGroup(id: 'chest_right', name: 'Göğüs', path: _createPath((p) {
        p.moveTo(100, 85); p.lineTo(125, 88); 
        p.quadraticBezierTo(132, 95, 135, 115);
        p.quadraticBezierTo(125, 130, 100, 125);
        p.close();
      })),
      MuscleGroup(id: 'abs', name: 'Karın', path: _createPath((p) {
        p.moveTo(85, 135); p.lineTo(115, 135); p.lineTo(112, 205); p.lineTo(88, 205); p.close();
      })),
      MuscleGroup(id: 'shoulder_left', name: 'Omuz', path: _createPath((p) {
         p.moveTo(70, 85); p.quadraticBezierTo(55, 85, 45, 100); p.lineTo(50, 115); p.lineTo(70, 120); p.close();
      })),
       MuscleGroup(id: 'shoulder_right', name: 'Omuz', path: _createPath((p) {
         p.moveTo(130, 85); p.quadraticBezierTo(145, 85, 155, 100); p.lineTo(150, 115); p.lineTo(130, 120); p.close();
      })),
       MuscleGroup(id: 'biceps_left', name: 'Biceps', path: _createPath((p) {
         p.moveTo(48, 120); p.quadraticBezierTo(42, 140, 45, 165); p.lineTo(55, 165); p.lineTo(65, 155); p.close();
      })),
       MuscleGroup(id: 'biceps_right', name: 'Biceps', path: _createPath((p) {
         p.moveTo(152, 120); p.quadraticBezierTo(158, 140, 155, 165); p.lineTo(145, 165); p.lineTo(135, 155); p.close();
      })),
       MuscleGroup(id: 'quads_left', name: 'Ön Bacak', path: _createPath((p) {
         p.moveTo(75, 210); p.lineTo(98, 210); p.lineTo(95, 320); p.lineTo(70, 320); p.close();
      })),
       MuscleGroup(id: 'quads_right', name: 'Ön Bacak', path: _createPath((p) {
         p.moveTo(102, 210); p.lineTo(125, 210); p.lineTo(130, 320); p.lineTo(105, 320); p.close();
      })),
    ];
  }

  List<MuscleGroup> _getBackMuscles() {
     return [
       MuscleGroup(id: 'traps', name: 'Trapez', path: _createPath((p) {
        p.moveTo(85, 75); p.quadraticBezierTo(100, 65, 115, 75); p.lineTo(108, 110); p.lineTo(92, 110); p.close();
      })),
      MuscleGroup(id: 'lats', name: 'Sırt', path: _createPath((p) {
        p.moveTo(80, 110); p.quadraticBezierTo(65, 125, 70, 170); p.lineTo(130, 170); p.quadraticBezierTo(135, 125, 120, 110); p.close();
      })),
        MuscleGroup(id: 'glutes', name: 'Kalça', path: _createPath((p) {
        p.moveTo(75, 210); p.quadraticBezierTo(100, 195, 125, 210); p.lineTo(130, 255); p.quadraticBezierTo(100, 270, 70, 255); p.close();
      })),
       MuscleGroup(id: 'hamstrings', name: 'Arka Bacak', path: _createPath((p) {
         p.addRect(const Rect.fromLTWH(70, 260, 60, 70));
      })),
    ];
  }

  Path _createPath(Function(Path) builder) {
    final path = Path();
    builder(path);
    return path;
  }

  @override
  Widget build(BuildContext context) {
    // Scale factor to map 200x400 coordinate system to screen size
    return LayoutBuilder(
      builder: (context, constraints) {
        final scaleX = constraints.maxWidth / 200;
        final scaleY = (constraints.maxWidth * 2) / 400; // Aspect ratio 1:2
        
        return GestureDetector(
          onTapUp: widget.isReadOnly ? null : (details) {
            final RenderBox box = context.findRenderObject() as RenderBox;
            final localPosition = box.globalToLocal(details.globalPosition);
            
            // Hit testing manually on scaled paths
            for (var muscle in muscles) {
              // Create a temporary matrix to transform the click point back to 200x400 space or transform path to screen space
              final scaledPath = muscle.path.transform(Matrix4.diagonal3Values(scaleX, scaleY, 1).storage);
              
              if (scaledPath.contains(localPosition)) {
                setState(() {
                  muscle.isSelected = !muscle.isSelected;
                  widget.onMuscleSelected?.call(muscle.name);
                });
                break; // Only select one at a time for overlap safety, or remove break for multiple
              }
            }
          },
          child: Container(
            width: constraints.maxWidth,
            height: constraints.maxWidth * 2,
            decoration: BoxDecoration(
                gradient: AppColors.radialBackground,
                borderRadius: BorderRadius.circular(40),
                boxShadow: const [
                  BoxShadow(color: Colors.black, blurRadius: 30) // Inset not supported directly
                ],
                border: Border.all(color: AppColors.zinc800.withOpacity(0.5)),
            ),
            child: CustomPaint(
              painter: AnatomyPainter(muscles: muscles, scaleX: scaleX, scaleY: scaleY),
            ),
          ),
        );
      },
    );
  }
}

class AnatomyPainter extends CustomPainter {
  final List<MuscleGroup> muscles;
  final double scaleX;
  final double scaleY;

  AnatomyPainter({required this.muscles, required this.scaleX, required this.scaleY});

  @override
  void paint(Canvas canvas, Size size) {
    
    // Scale canvas to match our 200x400 coordinate system
    canvas.scale(scaleX, scaleY);

    final Paint defaultPaint = Paint()
      ..color = const Color(0xFF1a1a1e)
      ..style = PaintingStyle.fill;
    
    final Paint strokePaint = Paint()
      ..color = const Color(0xFF333333)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 0.5;

    final Paint selectedPaint = Paint()
      ..color = AppColors.red600
      ..style = PaintingStyle.fill
      ..maskFilter = const MaskFilter.blur(BlurStyle.solid, 2); // Glow effect simplified

    final Paint selectedStrokePaint = Paint()
      ..color = AppColors.red600
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.0;

    // Draw silhouette (simplified)
    // In real app, draw this first
    
    for (var muscle in muscles) {
      canvas.drawPath(muscle.path, muscle.isSelected ? selectedPaint : defaultPaint);
      canvas.drawPath(muscle.path, muscle.isSelected ? selectedStrokePaint : strokePaint);
    }
  }

  @override
  bool shouldRepaint(covariant AnatomyPainter oldDelegate) => true;
}
