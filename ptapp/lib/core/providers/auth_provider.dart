import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_provider.g.dart';

enum UserRole {
  pt,
  student,
  guest
}

class AuthState {
  final bool isAuthenticated;
  final UserRole role;
  final String? userId;

  const AuthState({
    this.isAuthenticated = false,
    this.role = UserRole.guest,
    this.userId,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    UserRole? role,
    String? userId,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      role: role ?? this.role,
      userId: userId ?? this.userId,
    );
  }
}

@Riverpod(keepAlive: true)
class Auth extends _$Auth {
  @override
  AuthState build() => const AuthState();

  void loginAsPT() {
    state = const AuthState(isAuthenticated: true, role: UserRole.pt, userId: 'pt_1');
  }

  void loginAsStudent() {
    state = const AuthState(isAuthenticated: true, role: UserRole.student, userId: 'student_1');
  }

  void logout() {
    state = const AuthState(isAuthenticated: false, role: UserRole.guest, userId: null);
  }
}
