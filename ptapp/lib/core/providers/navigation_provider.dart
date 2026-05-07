import 'package:flutter_riverpod/flutter_riverpod.dart';

final bottomNavIndexProvider = NotifierProvider<BottomNavIndexNotifier, int>(BottomNavIndexNotifier.new);

class BottomNavIndexNotifier extends Notifier<int> {
  @override
  int build() => 0;

  void set(int index) {
    state = index;
  }
}
