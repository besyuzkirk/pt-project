import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/theme/app_colors.dart';
import '../../core/widgets/glass_card.dart';
import 'widgets/body_highlighter.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/providers/workout_history_provider.dart';

import 'data/models/workout_exercise.dart';
import 'data/mock_exercises.dart';

class WorkoutEntryScreen extends ConsumerStatefulWidget {
  final String? studentId;

  const WorkoutEntryScreen({super.key, this.studentId});

  @override
  ConsumerState<WorkoutEntryScreen> createState() => _WorkoutEntryScreenState();
}

class _WorkoutEntryScreenState extends ConsumerState<WorkoutEntryScreen> {
  Set<String> selectedMuscles = {};
  bool isBackView = false;
  String selectedIntensity = 'SERT ANTRENMAN';
  List<WorkoutExercise> selectedExercises = [];
  String notes = '';

  void _onSelectionChanged(Set<String> newSelection) {
    setState(() {
      selectedMuscles = newSelection;
    });
  }

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
              // Header
              Row(
                children: [
                   Expanded(
                     child: Row(
                      children: [
                        GestureDetector(
                          onTap: () => context.pop(),
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
                        Flexible(
                          child: Text.rich(
                            const TextSpan(
                              children: [
                                TextSpan(text: 'ANTRENMAN '),
                                TextSpan(
                                  text: 'LOGLA',
                                  style: TextStyle(color: AppColors.red600),
                                ),
                              ],
                            ),
                            style: const TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      ],
                     ),
                   ),
                   const SizedBox(width: 8),
                   GestureDetector(
                    onTap: () {
                      setState(() {
                        isBackView = !isBackView;
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.zinc900,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.zinc800),
                      ),
                      child: Row(
                        children: [
                           const Icon(LucideIcons.refreshCw, size: 14, color: AppColors.red600),
                           const SizedBox(width: 8),
                           Text(
                            isBackView ? 'ÖN' : 'ARKA', // Shortened label to save space, or keep if fits
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                            ),
                           ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              const Center(
                child: Text(
                  'ÇALIŞTIĞIN BÖLGELERİ İŞARETLE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AppColors.zinc500,
                    letterSpacing: 2,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Anatomy Map
              Center(
                child: SizedBox(
                  width: 220, // Match design approximate width
                  child: AspectRatio(
                    aspectRatio: 0.5, // 200/400 approx
                    child: BodyHighlighter(
                      svgPath: isBackView ? 'assets/body/back.svg' : 'assets/body/front.svg', // Updated paths
                      selectedParts: selectedMuscles,
                      onChanged: _onSelectionChanged,
                    ),
                  ),
                ),
              ),
               const SizedBox(height: 24),

               // Selected Tags
               Wrap(
                alignment: WrapAlignment.center,
                spacing: 8,
                runSpacing: 8,
                children: selectedMuscles.isEmpty 
                  ? [
                     const Text(
                      'LÜTFEN ANTRENMAN BÖLGELERİNİ SEÇİNİZ...',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppColors.zinc500,
                        letterSpacing: 1,
                        fontStyle: FontStyle.italic,
                      ),
                     )
                  ]
                  : selectedMuscles.map((m) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.red600.withValues(alpha: 0.1),
                      border: Border.all(color: AppColors.red600.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(99),
                      boxShadow: [
                         BoxShadow(
                          color: AppColors.red600.withValues(alpha: 0.15),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                         )
                      ]
                    ),
                    child: Text(
                      m.toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.red600,
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  )).toList(),
               ),
               const SizedBox(height: 32),

              // Exercise Search
              GlassCard(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Autocomplete<WorkoutExercise>(
                  optionsBuilder: (TextEditingValue textEditingValue) {
                    if (textEditingValue.text.isEmpty) {
                      return const Iterable<WorkoutExercise>.empty();
                    }
                    return mockExercises.where((WorkoutExercise option) {
                      return option.name.toLowerCase().contains(textEditingValue.text.toLowerCase());
                    });
                  },
                  displayStringForOption: (WorkoutExercise option) => option.name,
                  onSelected: (WorkoutExercise selection) {
                    setState(() {
                      // Add a copy so we can modify sets independently
                      selectedExercises.add(selection.copyWith());
                    });
                  },
                  fieldViewBuilder: (context, textEditingController, focusNode, onFieldSubmitted) {
                    return TextField(
                      controller: textEditingController,
                      focusNode: focusNode,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(
                        hintText: 'HAREKET EKLE (ARA)...',
                        hintStyle: TextStyle(
                          color: AppColors.zinc500,
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          fontStyle: FontStyle.italic,
                          letterSpacing: 1
                        ),
                        border: InputBorder.none,
                        icon: Icon(LucideIcons.search, color: AppColors.zinc500, size: 18),
                      ),
                    );
                  },
                  optionsViewBuilder: (context, onSelected, options) {
                    return Align(
                      alignment: Alignment.topLeft,
                      child: Material(
                        color: Colors.black,
                        elevation: 4.0,
                        child: SizedBox(
                          width: 300,
                          child: ListView.builder(
                            padding: EdgeInsets.zero,
                            shrinkWrap: true,
                            itemCount: options.length,
                            itemBuilder: (BuildContext context, int index) {
                              final WorkoutExercise option = options.elementAt(index);
                              return InkWell(
                                onTap: () => onSelected(option),
                                child: Container(
                                  padding: const EdgeInsets.all(16.0),
                                  decoration: const BoxDecoration(
                                    border: Border(bottom: BorderSide(color: AppColors.zinc900))
                                  ),
                                  child: Text(option.name, style: const TextStyle(color: Colors.white)),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 16),

              // Exercise List
              ...selectedExercises.asMap().entries.map((entry) {
                final index = entry.key;
                final exercise = entry.value;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GlassCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Title and Delete
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                             Expanded(
                               child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    exercise.name.toUpperCase(),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w900,
                                      fontSize: 14,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                  Text(
                                    exercise.type == ExerciseType.strength ? 'GÜÇ' : 'KARDİYO',
                                    style: const TextStyle(
                                      color: AppColors.red600,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                             ),
                             GestureDetector(
                                onTap: () {
                                  setState(() {
                                    selectedExercises.removeAt(index);
                                  });
                                },
                                child: const Icon(LucideIcons.x, color: AppColors.zinc500, size: 20),
                              ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        
                        // Inputs
                        if (exercise.type == ExerciseType.strength)
                          Row(
                            children: [
                              // Sets
                              Expanded(
                                child: _buildCompactInput(
                                  label: 'SET',
                                  hint: '0', 
                                  onChanged: (val) => exercise.sets = int.tryParse(val)
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Reps
                              Expanded(
                                flex: 2,
                                child: _buildCompactInput(
                                  label: 'TEKRAR', 
                                  hint: '12-10-8', 
                                  onChanged: (val) => exercise.reps = val
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Weight
                              Expanded(
                                flex: 2,
                                child: _buildCompactInput(
                                  label: 'AĞIRLIK', 
                                  hint: 'KG', 
                                  onChanged: (val) => exercise.weight = val
                                ),
                              ),
                            ],
                          )
                        else
                          Row(
                            children: [
                              Expanded(
                                child: _buildCompactInput(
                                  label: 'SÜRE (DK)',
                                  hint: '0', 
                                  onChanged: (val) => exercise.durationMinutes = int.tryParse(val)
                                ),
                              ),
                            ],
                          )
                      ],
                    ),
                  ),
                );
              }).toList(),

              const SizedBox(height: 24),

              // Session Metadata
              Row(
                children: [
                  Expanded(
                    child: GlassCard(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: selectedIntensity,
                          dropdownColor: AppColors.zinc900,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                          items: ['DÜŞÜK YOĞUNLUK', 'ORTA SEVİYE', 'SERT ANTRENMAN'].map((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value, style: const TextStyle(fontSize: 12, fontStyle: FontStyle.italic)),
                            );
                          }).toList(),
                          onChanged: (newValue) => setState(() => selectedIntensity = newValue!),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              GlassCard(
                padding: const EdgeInsets.all(16),
                child: TextField(
                  maxLines: 2,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(
                    hintText: 'Antrenman notları...',
                    hintStyle: TextStyle(color: AppColors.zinc500, fontSize: 12, fontStyle: FontStyle.italic),
                    border: InputBorder.none,
                  ),
                  onChanged: (val) => notes = val,
                ),
              ),
              const SizedBox(height: 32),

              // Save Button
              GestureDetector(
                onTap: () {
                  // Validate
                  if (selectedExercises.isEmpty && selectedMuscles.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Lütfen bölge seçin veya hareket ekleyin.')),
                    );
                    return;
                  }
                  
                  final session = WorkoutSession(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    studentId: widget.studentId,
                    date: DateTime.now(),
                    muscles: selectedMuscles,
                    exercises: selectedExercises,
                    intensity: selectedIntensity,
                    notes: notes,
                  );
                  
                  ref.read(workoutHistoryProvider.notifier).addSession(session);
                  
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Antrenman kaydedildi.')),
                  );

                  Navigator.pop(context);
                },
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [AppColors.red600, Color(0xFFcc0000)]),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(color: AppColors.red600.withValues(alpha: 0.4), blurRadius: 20, offset: const Offset(0, 8)),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      'KAYDI TAMAMLA',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900, letterSpacing: 1, fontStyle: FontStyle.italic),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
  Widget _buildCompactInput({
    required String label, 
    required String hint, 
    required Function(String) onChanged
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.zinc900,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.zinc800),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(color: AppColors.zinc500, fontSize: 12),
              border: InputBorder.none,
              isDense: true,
              contentPadding: const EdgeInsets.symmetric(vertical: 8),
            ),
            onChanged: onChanged,
          ),
          Text(
            label,
            style: const TextStyle(
              fontSize: 8,
              fontWeight: FontWeight.bold,
              color: AppColors.zinc500,
            ),
          ),
          const SizedBox(height: 4),
        ],
      ),
    );
  }
}
