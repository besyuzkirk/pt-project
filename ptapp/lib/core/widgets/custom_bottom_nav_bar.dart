import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ptapp/core/theme/app_colors.dart';
import 'package:easy_localization/easy_localization.dart';

import '../../core/providers/auth_provider.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;
  final UserRole role;

  const CustomBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
    required this.role,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.black.withOpacity(0.95),
        border: const Border(
          top: BorderSide(color: AppColors.zinc900),
        ),
      ),
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      child: role == UserRole.pt ? _buildPTRow() : _buildStudentRow(),
    );
  }

  Widget _buildStudentRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildNavItem(0, LucideIcons.layoutGrid, 'nav.home'.tr()),
        _buildNavItem(1, LucideIcons.calendarDays, 'nav.history'.tr()),
        
        // Center QR Button
        GestureDetector(
          onTap: () => onTap(2),
          child: Column(
             mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                margin: const EdgeInsets.only(bottom: 25), // Push it up slightly
                decoration: BoxDecoration(
                  gradient: AppColors.redGradient,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.black, width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.red600.withOpacity(0.5),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.qrCode, color: Colors.white, size: 32),
              ),
                   Text(
                    'nav.checkin'.tr(),
                    style: const TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: AppColors.red600,
                      letterSpacing: 2,
                    ),
                  ),
            ],
          ),
        ),

        _buildNavItem(3, LucideIcons.trendingUp, 'nav.progress'.tr()),
         _buildNavItem(4, LucideIcons.user, 'nav.profile'.tr()),
      ],
    );
  }

  Widget _buildPTRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildNavItem(0, LucideIcons.users, 'nav.students'.tr()),
        _buildNavItem(1, LucideIcons.calendarCheck, 'nav.calendar'.tr()),
        
        // Center QR Scan Button
        GestureDetector(
          onTap: () => onTap(2),
          child: Column(
             mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                margin: const EdgeInsets.only(bottom: 25),
                decoration: BoxDecoration(
                  gradient: AppColors.redGradient,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.black, width: 4),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.red600.withOpacity(0.5),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.scan, color: Colors.white, size: 32),
              ),
                   Text(
                    'nav.fast_qr'.tr(),
                    style: const TextStyle(
                      fontSize: 8,
                      fontWeight: FontWeight.w900,
                      color: AppColors.red600,
                      letterSpacing: 2,
                    ),
                  ),
            ],
          ),
        ),

        _buildNavItem(3, LucideIcons.barChart, 'nav.statistics'.tr()),
         _buildNavItem(4, LucideIcons.user, 'nav.profile'.tr()),
      ],
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = currentIndex == index;
    return GestureDetector(
      onTap: () => onTap(index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 24,
            color: isSelected ? AppColors.red600 : AppColors.zinc500,
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.w900,
              color: isSelected ? AppColors.red600 : AppColors.zinc500,
              letterSpacing: 1,
            ),
          ),
        ],
      ),
    );
  }
}
