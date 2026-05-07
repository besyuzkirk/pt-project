import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

// Import Screens
import '../../features/splash/splash_screen.dart';
import '../shell/main_shell.dart';
import '../../features/workout/workout_entry_screen.dart';

import '../../features/auth/login_screen.dart';
import '../../features/home/pt_student_detail_screen.dart';
import '../../features/goals/goals_screen.dart';
import '../../features/measurements/measurement_screen.dart';
import '../../features/history/workout_detail_screen.dart';
import '../../core/providers/workout_history_provider.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/workout',
      builder: (context, state) {
        final studentId = state.uri.queryParameters['studentId'];
        return WorkoutEntryScreen(studentId: studentId);
      },
    ),
    GoRoute(
      path: '/pt-student-detail/:id',
      builder: (context, state) {
        final idStr = state.pathParameters['id'];
        final id = int.tryParse(idStr ?? '0') ?? 0;
        return PtStudentDetailScreen(studentIndex: id);
      },
    ),
    GoRoute(
      path: '/goals',
      builder: (context, state) => const GoalsScreen(),
    ),
    GoRoute(
      path: '/measurements',
      builder: (context, state) => const MeasurementScreen(),
    ),
    GoRoute(
      path: '/workout-detail',
      builder: (context, state) {
        final session = state.extra as WorkoutSession?;
        return WorkoutDetailScreen(session: session);
      },
    ),
    ShellRoute(
      // We pass a dummy child because we are handling the body in MainShell's IndexStack
      // The ShellRoute is mainly here to wrap the "Home" route.
      // Actually, if we use IndexStack, we don't strictly need ShellRoute in this way,
      // but let's keep it to allow /home to launch the shell.
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/home',
          // We return a sized box because MainShell ignores the child and uses its own Internal State
          // This is a bit of a hack to get the BottomNav + State preservation working quickly without StatefulShellRoute
          builder: (context, state) => const SizedBox.shrink(),
        ),
      ],
    ),
  ],
);
