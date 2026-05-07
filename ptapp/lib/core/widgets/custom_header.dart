import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ptapp/core/theme/app_colors.dart';
import '../../core/providers/navigation_provider.dart';

class CustomHeader extends ConsumerWidget implements PreferredSizeWidget {
  const CustomHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.black.withOpacity(0.9),
        border: const Border(
          bottom: BorderSide(color: AppColors.zinc800),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.red600, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.red600.withOpacity(0.3),
                        blurRadius: 15,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'PT\nCC',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        height: 1,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          height: 1,
                        ),
                        children: [
                          TextSpan(text: 'CEM '),
                          TextSpan(
                            text: 'ÇAĞLAYAN',
                            style: TextStyle(color: AppColors.red600),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'PERSONAL TRAINING STUDIO',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.zinc500,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            GestureDetector(
              onTap: () {
                // Navigate to Profile Tab (Index 4)
                ref.read(bottomNavIndexProvider.notifier).set(4);
              },
              child: Stack(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.zinc900,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.zinc800),
                    ),
                    child: const Icon(LucideIcons.user, size: 20, color: AppColors.zinc400),
                  ),
                  // Optional notification dot logic can be added here if needed
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(90);
}
