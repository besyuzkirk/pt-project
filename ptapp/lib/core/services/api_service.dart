import 'package:flutter_riverpod/flutter_riverpod.dart';

final apiServiceProvider = Provider((ref) => ApiService());

class ApiService {
  Future<dynamic> get(String endpoint) async {
    // Dummy delay to simulate network request
    await Future.delayed(const Duration(seconds: 1));
    return {'message': 'Success from dummy API'};
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    // Dummy delay
    await Future.delayed(const Duration(seconds: 1));
    return {'message': 'Created successfully (dummy)'};
  }
}
