import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/widgets/custom_bottom_nav_bar.dart';
import '../../core/providers/navigation_provider.dart';

import '../../features/history/history_screen.dart';
import '../../features/qr/qr_screen.dart';
import '../../features/progress/progress_screen.dart';
import '../../features/profile/profile_screen.dart';
import '../../features/home/home_screen.dart';
import '../../features/home/pt_home_screen.dart';
import '../../features/calendar/pt_calendar_screen.dart';
import '../../core/providers/auth_provider.dart';

class MainShell extends ConsumerWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentIndex = ref.watch(bottomNavIndexProvider);
    final authState = ref.watch(authProvider);

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: null,
      body: Stack(
        children: [
          Positioned.fill(
            child: _buildBody(currentIndex, authState.role),
          ),
        ],
      ),
      bottomNavigationBar: CustomBottomNavBar(
        currentIndex: currentIndex,
        role: authState.role,
        onTap: (index) {
          ref.read(bottomNavIndexProvider.notifier).set(index);
        },
      ),
    );
  }

  Widget _buildBody(int index, UserRole role) {
    if (role == UserRole.pt) {
      switch (index) {
        case 0: return const PtHomeScreen();
        case 1: return const PtCalendarScreen();
        case 2: return const Center(child: Text("HIZLI QR", style: TextStyle(color: Colors.white)));
        case 3: return const Center(child: Text("PT GELİŞİM/İSTATİSTİK", style: TextStyle(color: Colors.white)));
        case 4: return const ProfileScreen();
        default: return const PtHomeScreen();
      }
    } else {
      switch (index) {
        case 0: return const HomeScreen();
        case 1: return const HistoryScreen();
        case 2: return const QRScreen();
        case 3: return const ProgressScreen();
        case 4: return const ProfileScreen();
        default: return const HomeScreen();
      }
    }
  }
}
