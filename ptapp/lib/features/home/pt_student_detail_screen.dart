import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:go_router/go_router.dart';

class PtStudentDetailScreen extends StatelessWidget {
  final int studentIndex;

  const PtStudentDetailScreen({super.key, required this.studentIndex});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Dark overlay matching theme
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text(
          '${"pt_student_detail.student_upper".tr()} ${studentIndex + 1}',
          style: const TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w900,
            fontStyle: FontStyle.italic,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Student Info Header
            Center(
              child: Column(
                children: [
                   Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.zinc800,
                      border: Border.all(color: AppColors.red600, width: 3),
                    ),
                    child: const Icon(Icons.person, color: Colors.white, size: 40),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '${"pt_student_detail.student_upper".tr()} ${studentIndex + 1}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'pt_student_detail.active_package_info'.tr(),
                    style: const TextStyle(
                      color: AppColors.zinc400,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Quick Actions Panel
            Row(
              children: [
                Expanded(
                  child: _buildActionCard(
                    icon: LucideIcons.target,
                    title: 'pt_student_detail.add_goal'.tr(),
                    color: AppColors.yellow500,
                    onTap: () {
                      _showActionDialog(context, 'pt_student_detail.add_goal'.tr(), 'pt_student_detail.hint_add_goal'.tr());
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionCard(
                    icon: LucideIcons.ruler,
                    title: 'pt_student_detail.add_measurement'.tr(),
                    color: Colors.white,
                    onTap: () {
                       _showActionDialog(context, 'pt_student_detail.dialog_add_measurement_title'.tr(), 'pt_student_detail.hint_add_measurement'.tr());
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionCard(
                    icon: LucideIcons.dumbbell,
                    title: 'pt_student_detail.assign_workout'.tr(),
                    color: AppColors.red600,
                    onTap: () {
                       context.push('/workout?studentId=student_$studentIndex');
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Recent Activities / Progress Overview
            Text(
              'pt_student_detail.recent_statistics'.tr(),
              style: const TextStyle(
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: FontWeight.w900,
                fontStyle: FontStyle.italic,
                color: Colors.white,
                letterSpacing: 1,
              ),
            ),
            const SizedBox(height: 16),
            GlassCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildStatRow('pt_student_detail.last_attendance'.tr(), '12 Nisan 2026', LucideIcons.calendarCheck),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Divider(color: Colors.white10)),
                  _buildStatRow('pt_student_detail.last_measurement_status'.tr(), '85.2 kg (-1kg)', LucideIcons.trendingDown),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Divider(color: Colors.white10)),
                  _buildStatRow('pt_student_detail.active_goals'.tr(), '2 Hedef Bekliyor', LucideIcons.target),
                ],
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard({required IconData icon, required String title, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 8),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(
              title,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: AppColors.zinc500, size: 18),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: AppColors.zinc400, fontSize: 13),
          ),
        ),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
        ),
      ],
    );
  }

  void _showActionDialog(BuildContext context, String title, String hint) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppColors.black,
        shape: RoundedRectangleBorder(
           borderRadius: BorderRadius.circular(16),
           side: BorderSide(color: AppColors.zinc800),
        ),
        title: Text(title, style: const TextStyle(color: Colors.white)),
        content: TextField(
          style: const TextStyle(color: Colors.white),
          maxLines: 3,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: AppColors.zinc500),
            enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: AppColors.zinc800)),
            focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: AppColors.red600)),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('pt_student_detail.cancel'.tr(), style: const TextStyle(color: AppColors.zinc500)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.red600),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('pt_student_detail.saved_to_system'.tr())),
              );
            },
            child: Text('pt_student_detail.save'.tr()),
          ),
        ],
      ),
    );
  }
}
