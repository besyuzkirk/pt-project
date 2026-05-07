class BodyPartModel {
  final String slug;
  final String? color; // Optional override
  final List<String> paths; // Flattened list of paths

  const BodyPartModel({
    required this.slug,
    this.color,
    required this.paths,
  });
}
