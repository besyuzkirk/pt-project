import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ptapp/core/theme/app_colors.dart';
import 'package:ptapp/core/widgets/glass_card.dart';
import '../../core/providers/workout_history_provider.dart';
import 'package:easy_localization/easy_localization.dart';
import '../workout/widgets/interactive_anatomy.dart';
import '../workout/data/models/workout_exercise.dart';

class WorkoutDetailScreen extends StatefulWidget {
  final WorkoutSession? session; // Passed session

  const WorkoutDetailScreen({super.key, this.session});

  @override
  State<WorkoutDetailScreen> createState() => _WorkoutDetailScreenState();
}

class _WorkoutDetailScreenState extends State<WorkoutDetailScreen> {
  bool isBackView = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.zinc900,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.zinc800),
                      ),
                      child: const Icon(LucideIcons.arrowLeft, size: 20, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Text.rich(
                    const TextSpan(
                      children: [
                        TextSpan(text: 'ANTRENMAN '),
                        TextSpan(
                          text: 'DETAYI',
                          style: TextStyle(color: AppColors.red600),
                        ),
                      ],
                    ),
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 20,
                      fontWeight: FontWeight.w900,
                      fontStyle: FontStyle.italic,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              if (widget.session != null && widget.session!.muscles.isNotEmpty) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'HEDEF BÖLGELER',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: AppColors.zinc500, fontStyle: FontStyle.italic),
                    ),
                    GestureDetector(
                      onTap: () => setState(() => isBackView = !isBackView),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.zinc900,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.zinc800),
                        ),
                        child: Text(
                          isBackView ? 'ÖN' : 'ARKA',
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Center(
                  child: SizedBox(
                    width: 200,
                    child: AspectRatio(
                      aspectRatio: 0.5,
                      child: InteractiveAnatomy(
                        isBackView: isBackView,
                        isReadOnly: true,
                        initialSelectedMuscles: widget.session!.muscles,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // Summary Card (Reused visual style)
              GlassCard(
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
                            Text(
                              widget.session != null 
                                  ? DateFormat('dd MMM yyyy').format(widget.session!.date).toUpperCase()
                                  : '8 OCAK 2026', 
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.zinc500, letterSpacing: 1.5, fontStyle: FontStyle.italic)
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.session != null ? widget.session!.intensity : 'GÖĞÜS & OMUZ', 
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, color: Colors.white)
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.red600.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                          child: const Text('BAŞARILI', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.red600, fontStyle: FontStyle.italic)),
                        )
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        _buildTag(LucideIcons.timer, '45DK'),
                        const SizedBox(width: 16),
                        _buildTag(LucideIcons.zap, 'SERT'),
                        const SizedBox(width: 16),
                        _buildTag(LucideIcons.dumbbell, '12.5 TON'),
                      ],
                    )
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Exercises List
              const Text(
                'HAREKETLER',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: AppColors.zinc500,
                  letterSpacing: 1.5,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 16),
              
              if (widget.session != null) ...[
                ...widget.session!.exercises.map((WorkoutExercise ex) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _buildExerciseItem(
                      ex.name, 
                      ex.type == ExerciseType.strength ? '${ex.sets ?? 0} Set' : '${ex.durationMinutes ?? 0} Dk', 
                      ex.type == ExerciseType.strength ? (ex.reps ?? '') : '-', 
                      ex.type == ExerciseType.strength ? (ex.weight ?? '') : '-'
                    ),
                  );
                }).toList()
              ] else ...[
                _buildExerciseItem('Incline Bench Press', '4 Set', '12-10-8-8 Tekrar', '60kg - 80kg'),
                const SizedBox(height: 12),
                _buildExerciseItem('Dumbbell Shoulder Press', '3 Set', '12 Tekrar', '20kg - 25kg'),
                const SizedBox(height: 12),
                _buildExerciseItem('Cable Crossover', '3 Set', '15 Tekrar', '15kg'),
                const SizedBox(height: 12),
                _buildExerciseItem('Lateral Raise', '4 Set', '15-12 Tekrar', '10kg'),
              ],
              
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTag(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.red600),
        const SizedBox(width: 6),
        Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, fontStyle: FontStyle.italic, color: AppColors.zinc400)),
      ],
    );
  }

  Widget _buildExerciseItem(String name, String sets, String reps, String weight) {
    return GlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            name,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildExerciseStat('SET', sets)),
              Expanded(child: _buildExerciseStat('TEKRAR', reps)),
              Expanded(child: _buildExerciseStat('AĞIRLIK', weight)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildExerciseStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: AppColors.zinc500,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Colors.white70,
          ),
        ),
      ],
    );
  }
}

// Helper to ensure zinc300 is available, if not fallback to zinc400
extension AppColorsExt on AppColors {
    static const Color zinc300 = Color(0xFFD4D4D8);
}
// Actually, I can't extend a class like that in the same file easily if AppColors is elsewhere.
// I'll check AppColors first or just use a known color.
// I'll replace AppColors.zinc300 with Colors.white70 for now to be safe.
