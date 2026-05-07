import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:ptapp/core/theme/app_colors.dart';
import 'package:ptapp/core/widgets/glass_card.dart';

class GoalsScreen extends StatefulWidget {
  const GoalsScreen({super.key});

  @override
  State<GoalsScreen> createState() => _GoalsScreenState();
}

class _GoalsScreenState extends State<GoalsScreen> {
  // Mock State for Targets
  double _targetWeight = 80.0;
  int _targetWorkoutsPerWeek = 4;

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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
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
                            TextSpan(text: 'HEDEF '),
                            TextSpan(
                              text: 'TAKİBİ',
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
                  GestureDetector(
                    onTap: _showEditTargetModal,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.red600.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.red600.withValues(alpha: 0.3)),
                      ),
                      child: const Row(
                        children: [
                          Icon(LucideIcons.edit3, size: 14, color: AppColors.red600),
                          SizedBox(width: 6),
                          Text(
                            'DÜZENLE',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: AppColors.red600,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Main Goal Card (Weight)
              GlassCard(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Text(
                      'HEDEF KİLO',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.zinc500,
                        letterSpacing: 2,
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      height: 200,
                      width: 200,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          // Background Circle
                          SizedBox(
                            width: 200,
                            height: 200,
                            child: CircularProgressIndicator(
                              value: 1.0,
                              strokeWidth: 12,
                              color: AppColors.zinc800,
                              strokeCap: StrokeCap.round,
                            ),
                          ),
                          // Progress Circle (55%)
                          SizedBox(
                            width: 200,
                            height: 200,
                            child: CircularProgressIndicator(
                              value: 0.55,
                              strokeWidth: 12,
                              color: AppColors.red600,
                              strokeCap: StrokeCap.round,
                              backgroundColor: Colors.transparent,
                            ),
                          ),
                          // Text Content
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                               const Text(
                                'GÜNCEL',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.zinc500,
                                ),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                '84.5',
                                style: TextStyle(
                                  fontSize: 40,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  height: 1,
                                ),
                              ),
                              const Text(
                                'son ölçüm', // Source indication
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.zinc500,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildGoalStat('BAŞLANGIÇ', '90.0', 'kg'),
                        _buildGoalStat('HEDEF', _targetWeight.toStringAsFixed(1), 'kg', isTarget: true),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Stats Row
              Row(
                children: [
                  Expanded(
                    child: GlassCard(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(LucideIcons.flame, color: AppColors.red600, size: 20),
                          const SizedBox(height: 12),
                          const Text(
                            'ANTRENMAN',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppColors.zinc500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          RichText(
                             text: TextSpan(
                               children: [
                                 const TextSpan(
                                   text: '2',
                                   style: TextStyle(
                                     fontSize: 20,
                                     fontWeight: FontWeight.w900,
                                     color: Colors.white,
                                     fontStyle: FontStyle.italic,
                                   ),
                                 ),
                                  TextSpan(
                                   text: ' / $_targetWorkoutsPerWeek',
                                   style: const TextStyle(
                                     fontSize: 14,
                                     fontWeight: FontWeight.bold,
                                     color: AppColors.zinc500,
                                   ),
                                 ),
                               ]
                             )
                          ),
                          const SizedBox(height: 2),
                           const Text(
                            'BU HAFTA',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppColors.zinc500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: GlassCard(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(LucideIcons.calendarCheck, color: AppColors.yellow500, size: 20),
                          const SizedBox(height: 12),
                          const Text(
                            'PROGRAM',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppColors.zinc500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'HAFTA 4/12',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                           const SizedBox(height: 2),
                           const Text(
                            'DEVAM EDİYOR',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: AppColors.zinc500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Measurement Tracking Summary
              const Text(
                'VÜCUT ÖLÇÜM TAKİBİ',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: AppColors.zinc500,
                  letterSpacing: 1.5,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 16),
              _buildMeasurementRow('Omuz Genişliği', '124 cm', '122 cm', true), // Increased
              const SizedBox(height: 12),
              _buildMeasurementRow('Bel Çevresi', '88 cm', '92 cm', false), // Decreased (Good)
               const SizedBox(height: 12),
              _buildMeasurementRow('Kol (Sağ)', '42 cm', '41 cm', true),
              
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }

  void _showEditTargetModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => _EditTargetModal(
        initialWeight: _targetWeight,
        initialWorkouts: _targetWorkoutsPerWeek,
        onSave: (weight, workouts) {
          setState(() {
            _targetWeight = weight;
            _targetWorkoutsPerWeek = workouts;
          });
        },
      ),
    );
  }

  Widget _buildGoalStat(String label, String value, String unit, {bool isTarget = false}) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: AppColors.zinc500,
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 4),
        Row(
          textBaseline: TextBaseline.alphabetic,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: isTarget ? AppColors.red600 : Colors.white,
              ),
            ),
            const SizedBox(width: 2),
            Text(
              unit,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: isTarget ? AppColors.red600.withValues(alpha: 0.7) : AppColors.zinc500,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMeasurementRow(String label, String current, String start, bool isImprovement) {
    // Logic: Improvement usually means Increase for muscle, Decrease for waist. 
    // Simplified visual here: Green for "Good change", Red for "Bad". 
    // For this mockup, let's assume Growth is Green, Shrink is ... depends.
    // Let's just show the change.
    
    return GlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
               Text(
                  label,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                 const SizedBox(height: 4),
                 Text(
                  'Başlangıç: $start',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppColors.zinc500,
                  ),
                ),
            ],
          ),
          Row(
            children: [
               Text(
                  current,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                  ),
                ),
                 const SizedBox(width: 8),
                 // Mock Change Indicator
                 Container(
                   padding: const EdgeInsets.all(4),
                   decoration: BoxDecoration(
                     color: isImprovement ? const Color(0xFF22C55E).withValues(alpha: 0.2) : AppColors.red600.withValues(alpha: 0.2),
                     shape: BoxShape.circle,
                   ),
                   child: Icon(
                     isImprovement ? LucideIcons.trendingUp : LucideIcons.trendingDown, 
                     size: 14, 
                     color: isImprovement ? const Color(0xFF22C55E) : AppColors.red600
                    ),
                 )
            ],
          )
        ],
      ),
    );
  }
}

class _EditTargetModal extends StatefulWidget {
  final double initialWeight;
  final int initialWorkouts;
  final Function(double, int) onSave;

  const _EditTargetModal({
    required this.initialWeight,
    required this.initialWorkouts,
    required this.onSave,
  });

  @override
  State<_EditTargetModal> createState() => _EditTargetModalState();
}

class _EditTargetModalState extends State<_EditTargetModal> {
  late TextEditingController _weightController;
  late TextEditingController _workoutController;

  @override
  void initState() {
    super.initState();
    _weightController = TextEditingController(text: widget.initialWeight.toString());
    _workoutController = TextEditingController(text: widget.initialWorkouts.toString());
  }

  @override
  void dispose() {
    _weightController.dispose();
    _workoutController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.zinc900,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        left: 24, 
        right: 24, 
        top: 24, 
        bottom: MediaQuery.of(context).viewInsets.bottom + 24
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'HEDEF DÜZENLE',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: Colors.white,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 32),
          
          // Weight Input
          const Text(
            'HEDEF KİLO (kg)',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: AppColors.zinc500,
            ),
          ),
          const SizedBox(height: 8),
          GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              controller: _weightController,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                border: InputBorder.none,
                suffixText: 'kg',
                suffixStyle: TextStyle(color: AppColors.zinc500),
              ),
            ),
          ),
           const SizedBox(height: 16),

           // Workout Freq Input
          const Text(
            'HAFTALIK ANTRENMAN HEDEFİ',
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: AppColors.zinc500,
            ),
          ),
          const SizedBox(height: 8),
          GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              controller: _workoutController,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                border: InputBorder.none,
                suffixText: 'antrenman',
                suffixStyle: TextStyle(color: AppColors.zinc500),
              ),
            ),
          ),

          const SizedBox(height: 32),
          GestureDetector(
            onTap: () {
              final w = double.tryParse(_weightController.text) ?? widget.initialWeight;
              final f = int.tryParse(_workoutController.text) ?? widget.initialWorkouts;
              widget.onSave(w, f);
              Navigator.pop(context);
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: AppColors.red600,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: Text(
                  'KAYDET',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
