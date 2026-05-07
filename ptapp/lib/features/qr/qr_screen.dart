import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';

class QRScreen extends StatelessWidget {
  const QRScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
           RichText(
            text: const TextSpan(
              style: TextStyle(fontFamily: 'Inter', fontSize: 48, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, height: 0.9),
              children: [
                TextSpan(text: 'STUDIO\n'),
                TextSpan(text: 'GİRİŞ', style: TextStyle(color: AppColors.red600)),
              ],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 48),
          Stack(
            alignment: Alignment.center,
            children: [
              Container(
                width: 300, height: 300,
                decoration: const BoxDecoration(
                   gradient: AppColors.redGradient,
                   borderRadius: BorderRadius.all(Radius.circular(999)),
                ),
                child: Container(color: Colors.transparent), // Just for blur effect if needed
              ).animate().fade(duration: 2000.ms, begin: 0.1, end: 0.3).scale(begin: const Offset(0.8, 0.8), end: const Offset(1.2, 1.2), duration: 2000.ms, curve: Curves.easeInOut).then(delay: 0.ms).scale(begin: const Offset(1.2, 1.2), end: const Offset(0.8, 0.8), duration: 2000.ms), // Animate placeholder 
              
              // We simulate the blur animation with a static container for now as we don't have flutter_animate
             
              Container(
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(50),
                  boxShadow: [
                    BoxShadow(color: AppColors.red600.withOpacity(0.5), blurRadius: 40),
                  ],
                  border: Border.all(color: Colors.black, width: 8),
                ),
                child: QrImageView(
                  data: 'PTCC_SESSION_ID_12345',
                  version: QrVersions.auto,
                  size: 200,
                  backgroundColor: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 48),
          GlassCard(
            child: Column(
               children: const [
                 Text('DYNAMIC SESSION TOKEN', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.zinc500, letterSpacing: 4, fontStyle: FontStyle.italic)),
                 SizedBox(height: 4),
                 Text('#PTCC-8492-X', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.red600, letterSpacing: 2, fontFamily: 'Courier')),
               ],
            ),
          ),
        ],
      ),
    );
  }
}

// Simple extension to mock animate() since we didn't add the package, to avoid errors.
// In real app add flutter_animate
extension AnimateMock on Widget {
   Widget animate() => this;
   Widget fade({Duration? duration, double? begin, double? end}) => this;
   Widget scale({Offset? begin, Offset? end, Duration? duration, Curve? curve}) => this;
   Widget then({Duration? delay}) => this;
}
extension DurationMock on int {
  Duration get ms => Duration(milliseconds: this);
}
