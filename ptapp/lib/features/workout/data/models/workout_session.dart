import 'workout_exercise.dart';

class WorkoutSession {
  final List<String> targetBodyParts;
  final List<WorkoutExercise> exercises;
  final String intensity;
  final String notes;
  final DateTime timestamp;

  WorkoutSession({
    required this.targetBodyParts,
    required this.exercises,
    required this.intensity,
    required this.notes,
    required this.timestamp,
  });
}
