enum ExerciseType {
  strength,
  cardio,
}

class WorkoutExercise {
  final String id;
  final String name;
  final ExerciseType type;
  int? sets;
  int? durationMinutes;
  String? reps; // e.g. "12-10-8"
  String? weight; // e.g. "60kg - 80kg"

  WorkoutExercise({
    required this.id,
    required this.name,
    required this.type,
    this.sets,
    this.durationMinutes,
    this.reps,
    this.weight,
  });

  WorkoutExercise copyWith({
    String? id,
    String? name,
    ExerciseType? type,
    int? sets,
    int? durationMinutes,
    String? reps,
    String? weight,
  }) {
    return WorkoutExercise(
      id: id ?? this.id,
      name: name ?? this.name,
      type: type ?? this.type,
      sets: sets ?? this.sets,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      reps: reps ?? this.reps,
      weight: weight ?? this.weight,
    );
  }
}
