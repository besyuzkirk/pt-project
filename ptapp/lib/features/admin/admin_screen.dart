import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
               RichText(
                text: const TextSpan(
                  style: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                  children: [
                    TextSpan(text: 'STUDIO '),
                    TextSpan(text: 'YÖNETİMİ', style: TextStyle(color: AppColors.red600)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: AppColors.red600, borderRadius: BorderRadius.circular(99)),
                child: const Text('ADMIN ACCESS', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1, color: Colors.white, fontStyle: FontStyle.italic)),
              )
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(20),
                   borderColor: AppColors.red600.withOpacity(0.5),
                   child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                       Text('AYLIK TAHMİN', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.zinc500, letterSpacing: 1, fontStyle: FontStyle.italic)),
                       SizedBox(height: 8),
                       Text('₺42.500', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                    ],
                   ),
                ),
              ),
              const SizedBox(width: 16),
               Expanded(
                child: GlassCard(
                  padding: const EdgeInsets.all(20),
                   borderColor: AppColors.zinc800,
                   child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                       Text('DOLULUK ORANI', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.zinc500, letterSpacing: 1, fontStyle: FontStyle.italic)),
                       SizedBox(height: 8),
                       Text('48 / 50', style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                    ],
                   ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text('AKTİF ÜYELER', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.zinc500, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
          const SizedBox(height: 12),
          GlassCard(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(color: AppColors.zinc900, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.zinc800)),
                  child: const Center(child: Text('CÖ', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.red600))),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('CANBERK ÖZCAN', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                      Text('Giriş Yapıldı: 14:00', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: AppColors.zinc500, fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
                const Icon(LucideIcons.chevronRight, color: AppColors.zinc500, size: 20),
              ],
            ),
          )
        ],
      ),
    );
  }
}
