import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/custom_header.dart';
import '../../core/widgets/glass_card.dart';
import 'package:easy_localization/easy_localization.dart';

class PtCalendarScreen extends StatelessWidget {
  const PtCalendarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text(
                'pt_calendar.title'.tr(),
                style: const TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: Colors.white,
                ),
              ),
            ),
            
            // Weekly Strip
            _buildWeeklyStrip(),

            const SizedBox(height: 16),
            
            // Daily Schedule Timeline
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                children: [
                  _buildTimeSlot('09:00', isAvailable: true),
                  _buildTimeSlot('10:00', isAvailable: false, studentName: 'Ahmet Yılmaz', type: 'Personal Training'),
                  _buildTimeSlot('11:00', isAvailable: false, studentName: 'Mehmet Öz', type: 'Kardiyo Check-in'),
                  _buildTimeSlot('12:00', isAvailable: true),
                  _buildTimeSlot('13:00', isAvailable: true),
                  _buildTimeSlot('14:00', isAvailable: false, studentName: 'Ayşe Kaya', type: 'Personal Training'),
                  _buildTimeSlot('15:00', isAvailable: true),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWeeklyStrip() {
    final days = [
      'pt_calendar.days.mon'.tr(),
      'pt_calendar.days.tue'.tr(),
      'pt_calendar.days.wed'.tr(),
      'pt_calendar.days.thu'.tr(),
      'pt_calendar.days.fri'.tr(),
      'pt_calendar.days.sat'.tr(),
      'pt_calendar.days.sun'.tr(),
    ];
    final dates = ['12', '13', '14', '15', '16', '17', '18'];
    final todayIndex = 2; // Simulated 'ÇAR, 14' is today

    return SizedBox(
      height: 80,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: 7,
        separatorBuilder: (context, _) => const SizedBox(width: 12),
        itemBuilder: (context, index) {
          final isToday = index == todayIndex;
          return GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            borderRadius: 16,
            child: Container(
              decoration: isToday ? BoxDecoration(
                border: Border(bottom: BorderSide(color: AppColors.red600, width: 3)),
              ) : null,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    days[index],
                    style: TextStyle(
                      color: isToday ? AppColors.white : AppColors.zinc500,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    dates[index],
                    style: TextStyle(
                      color: isToday ? AppColors.white : AppColors.zinc500,
                      fontWeight: FontWeight.w900,
                      fontSize: 20,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimeSlot(String time, {required bool isAvailable, String? studentName, String? type}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 60,
            child: Text(
              time,
              style: const TextStyle(
                color: AppColors.zinc500,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: isAvailable
                ? Container(
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.zinc900.withValues(alpha: 0.5),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.zinc800, style: BorderStyle.solid),
                    ),
                    child: Center(
                      child: Text(
                        'pt_calendar.empty'.tr(),
                        style: const TextStyle(
                          color: AppColors.zinc500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  )
                : Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [AppColors.red600.withValues(alpha: 0.8), AppColors.red600.withValues(alpha: 0.5)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.red600),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.red600.withValues(alpha: 0.2),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          studentName ?? 'pt_calendar.unknown_student'.tr(),
                          style: const TextStyle(
                            color: AppColors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          type ?? 'pt_calendar.lesson'.tr(),
                          style: TextStyle(
                            color: AppColors.white.withValues(alpha: 0.8),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
