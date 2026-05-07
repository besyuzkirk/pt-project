import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';

class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black, // Ensure background is black
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
               const SizedBox(height: 16),
               RichText(
                text: const TextSpan(
                  style: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                  children: [
                    TextSpan(text: 'GELİŞİM '),
                    TextSpan(text: 'GALERİSİ', style: TextStyle(color: AppColors.red600)),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              
              // Comparison Row
              Row(
                children: [
                  // Start Photo
                  Expanded(
                    child: Column(
                      children: [
                        const Text('BAŞLANGIÇ', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.zinc500, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                        const SizedBox(height: 12),
                        AspectRatio(
                          aspectRatio: 3/4,
                          child: Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  image: const DecorationImage(
                                    image: AssetImage('assets/progress/start.png'),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              // Tint overlay
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.6),
                                    ],
                                  ),
                                ),
                              ),
                              const Positioned(
                                bottom: 12,
                                left: 12,
                                child: Text('1 OCAK', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  
                  // Current Photo
                  Expanded(
                    child: Column(
                      children: [
                        const Text('GÜNCEL', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.red600, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                         const SizedBox(height: 12),
                        AspectRatio(
                          aspectRatio: 3/4,
                          child: Stack(
                            children: [
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: AppColors.red600, width: 2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppColors.red600.withValues(alpha: 0.2),
                                      blurRadius: 20,
                                      offset: const Offset(0, 4),
                                    )
                                  ],
                                  image: const DecorationImage(
                                    image: AssetImage('assets/progress/current.png'),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                               // Tint overlay
                              Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.6),
                                    ],
                                  ),
                                ),
                              ),
                              const Positioned(
                                bottom: 12,
                                left: 12,
                                child: Text('BUGÜN', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                              )
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // Add Photo Button
              GestureDetector(
                onTap: () {
                   // Placeholder for image picker
                   ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Fotoğraf ekleme özelliği yakında...')));
                },
                child: GlassCard(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  child: Column(
                    children: const [
                      Icon(Icons.add_a_photo, color: AppColors.red600, size: 32),
                      SizedBox(height: 12),
                      Text('YENİ FOTOĞRAF EKLE', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1)),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
