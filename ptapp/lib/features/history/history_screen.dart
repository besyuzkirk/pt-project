import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ptapp/core/providers/auth_provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';
import 'workout_detail_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/workout_history_provider.dart';
import 'package:easy_localization/easy_localization.dart';

class HistoryScreen extends ConsumerWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final history = ref.watch(workoutHistoryProvider).where((session) {
      if (auth.role == UserRole.student) {
        return session.studentId == auth.userId;
      }
      return true; // PT sees all or we can filter by their assigned ones later
    }).toList();

    return Container(
      color: Colors.black, // Ensure background is black for SafeArea
      child: SafeArea( // Fixed Header Layout
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16), // Added spacing
              RichText(
                text: const TextSpan(
                  style: TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                  children: [
                    TextSpan(text: 'ANTRENMAN '),
                    TextSpan(text: 'GEÇMİŞİ', style: TextStyle(color: AppColors.red600)),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              if (history.isEmpty)
                const Expanded(
                  child: Center(
                    child: Text(
                      'HENÜZ ANTRENMAN GEÇMİŞİNİZ YOK.',
                      style: TextStyle(color: AppColors.zinc500, fontSize: 12, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic),
                    ),
                  ),
                )
              else
                Expanded(
                  child: ListView.builder(
                    itemCount: history.length,
                    itemBuilder: (context, index) {
                      final session = history[history.length - 1 - index]; // Reverse chronological
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: GestureDetector( // Link to Detail Screen
                          onTap: () {
                             context.push('/workout-detail', extra: session);
                          },
                          child: GlassCard(
                            padding: const EdgeInsets.all(20),
                            borderColor: AppColors.red600.withValues(alpha: 0.3),
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(DateFormat('dd MMM yyyy').format(session.date).toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.zinc500, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                                        Text(session.intensity, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(color: AppColors.red600.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                                      child: const Text('TAMAMLANDI', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.red600, fontStyle: FontStyle.italic)),
                                    )
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    _buildTag(LucideIcons.dumbbell, '${session.exercises.length} Hareket'),
                                    const SizedBox(width: 12),
                                    _buildTag(LucideIcons.target, '${session.muscles.length} Bölge'),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTag(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.red600),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic, color: AppColors.zinc400)),
      ],
    );
  }
}
