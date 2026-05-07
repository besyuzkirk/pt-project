import 'package:flutter/material.dart';

class AppColors {
  static const Color black = Color(0xFF000000);
  static const Color darkZinc = Color(0xFF111111);
  static const Color zinc900 = Color(0xFF18181B);
  static const Color zinc800 = Color(0xFF27272A);
  static const Color zinc500 = Color(0xFF71717A);
  static const Color zinc400 = Color(0xFFA1A1AA);
  static const Color red600 = Color(0xFFFF3131); // Adjusted exact red from design
  static const Color darkRed = Color(0xFF8B0000);
  static const Color white = Color(0xFFFFFFFF);
  static const Color yellow500 = Color(0xFFEAB308);
  
  static const LinearGradient redGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFF0000), Color(0xFF8B0000)],
  );

  static const RadialGradient radialBackground = RadialGradient(
    center: Alignment.center,
    radius: 0.8,
    colors: [Color(0xFF111111), Color(0xFF000000)],
  );
}
