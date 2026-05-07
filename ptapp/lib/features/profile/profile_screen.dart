import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: Colors.black, // Ensure background is black
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              // Header
          Center(
            child: Column(
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    color: AppColors.zinc900,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.red600, width: 3),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.red600.withValues(alpha: 0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'CÇ',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: AppColors.red600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                RichText(
                  text: const TextSpan(
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      fontStyle: FontStyle.italic,
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
                  'PERSONAL TRAINER',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppColors.zinc500,
                    letterSpacing: 2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Menu Items
          GlassCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                _buildMenuItem(LucideIcons.user, 'HESAP BİLGİLERİ'),
                _buildDivider(),
                _buildMenuItem(LucideIcons.dumbbell, 'ANTRENMAN GEÇMİŞİ'),
                _buildDivider(),
                _buildMenuItem(LucideIcons.creditCard, 'ÜYELİK VE ÖDEMELER'),
                _buildDivider(),
                _buildMenuItem(LucideIcons.settings, 'AYARLAR'),
              ],
            ),
          ),
          const SizedBox(height: 24),

          GlassCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                _buildMenuItem(LucideIcons.helpCircle, 'YARDIM & DESTEK'),
                _buildDivider(),
                _buildMenuItem(
                  LucideIcons.logOut, 
                  'ÇIKIŞ YAP', 
                  isDestructive: true,
                  onTap: () {
                    ref.read(authProvider.notifier).logout();
                    context.go('/login');
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 100), // Bottom padding
        ],
      ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String label, {bool isDestructive = false, VoidCallback? onTap}) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap ?? () {},
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: isDestructive ? AppColors.red600 : AppColors.white,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: isDestructive ? AppColors.red600 : AppColors.white,
                    letterSpacing: 1,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
              Icon(
                LucideIcons.chevronRight,
                size: 16,
                color: isDestructive ? AppColors.red600.withValues(alpha: 0.5) : AppColors.zinc500,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 1,
      color: AppColors.white.withValues(alpha: 0.05),
    );
  }
}
