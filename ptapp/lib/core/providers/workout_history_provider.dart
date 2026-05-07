import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../features/workout/data/models/workout_exercise.dart';

part 'workout_history_provider.g.dart';

class WorkoutSession {
  final String id;
  final String? studentId; // If null, belongs to the current user. If PT assigns it, belongs to studentId.
  final DateTime date;
  final Set<String> muscles;
  final List<WorkoutExercise> exercises;
  final String intensity;
  final String notes;

  WorkoutSession({
    required this.id,
    this.studentId,
    required this.date,
    required this.muscles,
    required this.exercises,
    required this.intensity,
    required this.notes,
  });
}

@Riverpod(keepAlive: true)
class WorkoutHistory extends _$WorkoutHistory {
  @override
  List<WorkoutSession> build() {
    return []; // Empty initially, can mock data later
  }

  void addSession(WorkoutSession session) {
    state = [...state, session];
  }
}
