import 'dart:ui';
import 'package:flutter/services.dart';
import 'package:path_drawing/path_drawing.dart';
import 'package:xml/xml.dart';

class BodyPart {
  final String id;
  final Path path;

  BodyPart({required this.id, required this.path});
}

class SvgBodyParser {
  /// Loads an SVG from assets and parses <path> elements with 'id' attributes.
  Future<List<BodyPart>> loadAndParseSvg(String assetPath) async {
    final String svgContent = await rootBundle.loadString(assetPath);
    final XmlDocument document = XmlDocument.parse(svgContent);
    
    final List<BodyPart> parts = [];
    
    // Find all 'path' elements
    final Iterable<XmlElement> paths = document.findAllElements('path');
    
    for (var element in paths) {
      final String? id = element.getAttribute('id');
      final String? d = element.getAttribute('d');
      
      if (id != null && d != null) {
        // Parse SVG path data into a Flutter Path
        final Path path = parseSvgPathData(d);
        parts.add(BodyPart(id: id, path: path));
      }
    }
    
    // Handle groups <g> if necessary (recursive or flattened) - keeping it simple for now
    // If the SVG structure wraps paths in groups, findAllElements('path') still finds them fully recursively.
    
    return parts;
  }
}
