import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';
import '../../features/measurements/measurement_screen.dart';
import '../../features/goals/goals_screen.dart';

import '../../core/widgets/custom_header.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.transparent, // Background handled by AppTheme/Scaffold
      body: SingleChildScrollView(
        padding: EdgeInsets.zero, // Remove Global Padding to allow Header to be full width
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Scrollable Header
            const CustomHeader(),
            
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Action Buttons Grid
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionButton(
                          context,
                          icon: LucideIcons.dumbbell,
                          label: 'ANTRENMAN',
                          color: AppColors.red600,
                          onTap: () => context.push('/workout'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionButton(
                          context,
                          icon: LucideIcons.ruler,
                          label: 'ÖLÇÜM',
                          color: AppColors.white,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const MeasurementScreen()),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionButton(
                          context,
                          icon: LucideIcons.trophy,
                          label: 'HEDEFİM',
                          color: AppColors.yellow500,
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (context) => const GoalsScreen()),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Completed Lessons Progress
            GlassCard(
              padding: EdgeInsets.zero,
              child: Stack(
                children: [
                  // Content
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'TAMAMLANAN DERSLER',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: AppColors.yellow500,
                            fontStyle: FontStyle.italic,
                            letterSpacing: 1.5,
                          ),
                        ),
                        const SizedBox(height: 8),
                        RichText(
                          text: const TextSpan(
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              fontStyle: FontStyle.italic,
                              height: 1.1,
                            ),
                            children: [
                              TextSpan(text: '8 DERS '),
                              TextSpan(
                                text: 'TAMAMLANDI',
                                style: TextStyle(color: AppColors.white),
                              ),
                              TextSpan(
                                text: '\nKALAN 4 DERS',
                                style: TextStyle(
                                  color: AppColors.zinc500, 
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        
                        // Progress Bar
                        Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: AppColors.zinc800,
                            borderRadius: BorderRadius.circular(99),
                          ),
                          child: FractionallySizedBox(
                            widthFactor: 8/12, // Calculated progress
                            alignment: Alignment.centerLeft,
                            child: Container(
                              decoration: BoxDecoration(
                                color: AppColors.yellow500,
                                borderRadius: BorderRadius.circular(99),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.yellow500.withValues(alpha: 0.4),
                                    blurRadius: 10,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Top Border Accent
                  Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: Container(
                      height: 2,
                      color: AppColors.yellow500.withValues(alpha: 0.3),
                    ),
                  ),
                ],
              ),
            ),
                  const SizedBox(height: 24),


                  // Weight Chart Card
                  GlassCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                         Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: const [
                            Text(
                              'KİLO DEĞİŞİMİ',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w900,
                                color: AppColors.zinc400,
                                fontStyle: FontStyle.italic,
                                letterSpacing: 1,
                              ),
                            ),
                            Text(
                              '84.5 kg',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: AppColors.white,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 150,
                          child: _buildChart(),
                        ),
                      ],
                    ),
                  ),
                  
                  // Bottom Padding for Nav Bar
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(BuildContext context,
      {required IconData icon,
      required String label,
      required Color color,
      required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: GlassCard(
        padding: EdgeInsets.zero, // Handle padding manually
        borderRadius: 24,
        child: Stack(
          children: [
            // Content
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(icon, color: color, size: 20),
                    const SizedBox(height: 8),
                    Text(
                      label,
                      style: const TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        color: AppColors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Bottom Border Accent
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Container(
                height: 2,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChart() {
    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          getDrawingHorizontalLine: (value) => FlLine(
            color: Colors.white.withOpacity(0.03),
            strokeWidth: 1,
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          bottomTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)), // Simplify for now
          leftTitles: AxisTitles(
             sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (value, meta) {
                return Text(
                  value.toInt().toString(),
                  style: const TextStyle(
                    color: AppColors.zinc500,
                    fontSize: 9,
                    fontWeight: FontWeight.bold,
                  ),
                );
              },
             ),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0,
        maxX: 3,
        minY: 80,
        maxY: 90,
        lineBarsData: [
          LineChartBarData(
            spots: const [
              FlSpot(0, 89.2),
              FlSpot(1, 86.5),
              FlSpot(2, 85.1),
              FlSpot(3, 84.5),
            ],
            isCurved: true,
            color: AppColors.red600,
            barWidth: 4,
            isStrokeCapRound: true,
            dotData: FlDotData(
              show: true,
              getDotPainter: (spot, percent, barData, index) => FlDotCirclePainter(
                radius: 4,
                color: AppColors.red600,
                strokeWidth: 2,
                strokeColor: AppColors.black,
              ),
            ),
            belowBarData: BarAreaData(
              show: true,
              gradient: LinearGradient(
                colors: [
                  AppColors.red600.withOpacity(0.2),
                  AppColors.red600.withOpacity(0.0),
                ],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
