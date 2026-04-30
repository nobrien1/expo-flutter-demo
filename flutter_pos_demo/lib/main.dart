import 'dart:math';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const PerformanceApp());
}

const _seedColor = Color(0xFF0F766E);

final List<InventoryItem> _inventory = buildInventory();
final InventorySummary _summary = summarizeInventory(_inventory);

class PerformanceApp extends StatelessWidget {
  const PerformanceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Performance Lab',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: _seedColor),
        textTheme: GoogleFonts.spaceGroteskTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFF5F7F6),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
          seedColor: _seedColor,
          brightness: Brightness.dark,
        ),
        textTheme: GoogleFonts.spaceGroteskTextTheme(
          ThemeData.dark().textTheme,
        ),
      ),
      home: const PerformanceShell(),
    );
  }
}

class PerformanceShell extends StatefulWidget {
  const PerformanceShell({super.key});

  @override
  State<PerformanceShell> createState() => _PerformanceShellState();
}

class _PerformanceShellState extends State<PerformanceShell> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _index,
        children: [
          OverviewScreen(summary: _summary),
          InventoryScreen(items: _inventory),
          const InsightsScreen(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _index,
        onTap: (value) => setState(() => _index = value),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.speed), label: 'Overview'),
          BottomNavigationBarItem(
            icon: Icon(Icons.view_list),
            label: 'Workload',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.auto_awesome),
            label: 'Insights',
          ),
        ],
      ),
    );
  }
}

class OverviewScreen extends StatelessWidget {
  const OverviewScreen({super.key, required this.summary});

  final InventorySummary summary;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(child: HeroCard(summary: summary)),
          SliverToBoxAdapter(child: MetricGrid(summary: summary)),
          const SliverToBoxAdapter(child: AdvantagePanel()),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
        ],
      ),
    );
  }
}

class HeroCard extends StatelessWidget {
  const HeroCard({super.key, required this.summary});

  final InventorySummary summary;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      padding: const EdgeInsets.all(20),
      height: 220,
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: scheme.shadow.withOpacity(0.08),
            blurRadius: 24,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Stack(
        children: [
          Positioned(
            top: -30,
            left: -20,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                color: scheme.primary.withOpacity(0.16),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Positioned(
            right: -10,
            bottom: -20,
            child: Container(
              width: 170,
              height: 170,
              decoration: BoxDecoration(
                color: scheme.tertiary.withOpacity(0.18),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Performance Lab',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Sliver lists + animated gauges keep frames smooth while filtering ${summary.total} items.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurface.withOpacity(0.7),
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.bottomRight,
            child: Icon(Icons.speed, size: 88, color: scheme.primary),
          ),
        ],
      ),
    );
  }
}

class MetricGrid extends StatelessWidget {
  const MetricGrid({super.key, required this.summary});

  final InventorySummary summary;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final cardWidth = (constraints.maxWidth - 12) / 2;
          return Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              SizedBox(
                width: cardWidth,
                child: MetricCard(
                  label: 'Active SKUs',
                  value: summary.total.toDouble(),
                  suffix: '',
                  accent: const Color(0xFF0EA5E9),
                ),
              ),
              SizedBox(
                width: cardWidth,
                child: MetricCard(
                  label: 'Low stock',
                  value: summary.lowStock.toDouble(),
                  suffix: '',
                  accent: const Color(0xFFF97316),
                ),
              ),
              SizedBox(
                width: cardWidth,
                child: MetricCard(
                  label: 'Avg price',
                  value: summary.avgPrice,
                  prefix: '\$',
                  suffix: '',
                  accent: const Color(0xFF22C55E),
                  fractionDigits: 2,
                ),
              ),
              SizedBox(
                width: cardWidth,
                child: MetricCard(
                  label: 'Fast movers',
                  value: summary.fastMovers.toDouble(),
                  suffix: '',
                  accent: const Color(0xFFA855F7),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class MetricCard extends StatelessWidget {
  const MetricCard({
    super.key,
    required this.label,
    required this.value,
    required this.accent,
    this.prefix = '',
    this.suffix = '',
    this.fractionDigits = 0,
  });

  final String label;
  final double value;
  final String prefix;
  final String suffix;
  final Color accent;
  final int fractionDigits;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: scheme.outlineVariant.withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 6,
            decoration: BoxDecoration(
              color: accent,
              borderRadius: BorderRadius.circular(99),
            ),
          ),
          const SizedBox(height: 10),
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: value),
            duration: const Duration(milliseconds: 900),
            builder: (context, animatedValue, child) {
              final formatted = animatedValue.toStringAsFixed(fractionDigits);
              return Text(
                '$prefix$formatted$suffix',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700),
              );
            },
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: scheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}

class AdvantagePanel extends StatelessWidget {
  const AdvantagePanel({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Flutter advantage',
            style: Theme.of(
              context,
            ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 8),
          Text(
            'Skia rendering keeps layout consistent and animations deterministic on every device.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: scheme.onSurface.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({super.key, required this.items});

  final List<InventoryItem> items;

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen> {
  final TextEditingController _controller = TextEditingController();
  String _query = '';
  String _category = 'All';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final filtered = _filteredItems();

    return SafeArea(
      child: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 6),
                  Text(
                    '${filtered.length} / ${widget.items.length}',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: scheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _controller,
                    onChanged: (value) => setState(() => _query = value),
                    decoration: InputDecoration(
                      hintText: 'Search',
                      prefixIcon: const Icon(Icons.search),
                      filled: true,
                      fillColor: scheme.surface,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide(
                          color: scheme.outlineVariant.withOpacity(0.5),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: inventoryCategories
                        .map(
                          (option) => ChoiceChip(
                            label: Text(option),
                            selected: _category == option,
                            onSelected: (_) =>
                                setState(() => _category = option),
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
          ),
          SliverFixedExtentList(
            itemExtent: 72,
            delegate: SliverChildBuilderDelegate((context, index) {
              final item = filtered[index];
              return InventoryRow(item: item);
            }, childCount: filtered.length),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }

  List<InventoryItem> _filteredItems() {
    final normalized = _query.trim().toLowerCase();
    return widget.items.where((item) {
      final matchesCategory = _category == 'All' || item.category == _category;
      final matchesQuery =
          normalized.isEmpty || item.name.toLowerCase().contains(normalized);
      return matchesCategory && matchesQuery;
    }).toList();
  }
}

class InventoryRow extends StatelessWidget {
  const InventoryRow({super.key, required this.item});

  final InventoryItem item;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final trendColor = item.trendUp
        ? const Color(0xFF22C55E)
        : const Color(0xFFF97316);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: scheme.surface,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    item.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.category,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: scheme.onSurface.withOpacity(0.6),
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '\$${item.price.toStringAsFixed(2)}',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      width: 26,
                      height: 6,
                      decoration: BoxDecoration(
                        color: trendColor,
                        borderRadius: BorderRadius.circular(99),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${item.stock} in stock',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: scheme.onSurface.withOpacity(0.6),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class InsightsScreen extends StatelessWidget {
  const InsightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
        children: const [
          InsightHeader(),
          SizedBox(height: 16),
          PulseBar(
            label: 'Raster throughput',
            caption: 'Skia render pipeline',
            color: Color(0xFF6366F1),
            duration: Duration(milliseconds: 1100),
          ),
          PulseBar(
            label: 'Input latency',
            caption: 'Gesture pipeline',
            color: Color(0xFF22C55E),
            duration: Duration(milliseconds: 1400),
          ),
          PulseBar(
            label: 'Navigation',
            caption: 'Native transitions',
            color: Color(0xFFF97316),
            duration: Duration(milliseconds: 1250),
          ),
          SizedBox(height: 20),
          AdvantageCard(
            icon: Icons.auto_awesome,
            title: 'Predictable layout',
            body:
                'Widgets own their pixels, so UI stays consistent across devices and OS versions.',
          ),
          AdvantageCard(
            icon: Icons.speed,
            title: 'AOT release builds',
            body:
                'Compiled Dart keeps startup fast and removes the JS bridge for production.',
          ),
          AdvantageCard(
            icon: Icons.layers,
            title: 'Unified rendering',
            body:
                'Skia draws each frame, giving designers a single source of truth.',
          ),
        ],
      ),
    );
  }
}

class InsightHeader extends StatelessWidget {
  const InsightHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Stack(
        children: [
          Positioned(
            top: -30,
            right: -20,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                color: scheme.primary.withOpacity(0.16),
                shape: BoxShape.circle,
              ),
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Flutter strengths',
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              Text(
                'These animated bars stay smooth while the workload list filters thousands of rows.',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurface.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class PulseBar extends StatefulWidget {
  const PulseBar({
    super.key,
    required this.label,
    required this.caption,
    required this.color,
    required this.duration,
  });

  final String label;
  final String caption;
  final Color color;
  final Duration duration;

  @override
  State<PulseBar> createState() => _PulseBarState();
}

class _PulseBarState extends State<PulseBar>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: widget.duration,
  )..repeat(reverse: true);
  late final Animation<double> _animation = CurvedAnimation(
    parent: _controller,
    curve: Curves.easeInOut,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.label,
            style: Theme.of(
              context,
            ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            widget.caption,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: scheme.onSurface.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: 12),
          AnimatedBuilder(
            animation: _animation,
            builder: (context, child) {
              final value = 0.2 + _animation.value * 0.8;
              return LinearProgressIndicator(
                value: value,
                backgroundColor: scheme.outlineVariant.withOpacity(0.3),
                valueColor: AlwaysStoppedAnimation<Color>(widget.color),
                minHeight: 8,
                borderRadius: BorderRadius.circular(99),
              );
            },
          ),
        ],
      ),
    );
  }
}

class AdvantageCard extends StatelessWidget {
  const AdvantageCard({
    super.key,
    required this.icon,
    required this.title,
    required this.body,
  });

  final IconData icon;
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surface,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: scheme.primary.withOpacity(0.18),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: scheme.primary, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  body,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurface.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class InventoryItem {
  InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.stock,
    required this.velocity,
    required this.trendUp,
  });

  final String id;
  final String name;
  final String category;
  final double price;
  final int stock;
  final int velocity;
  final bool trendUp;
}

class InventorySummary {
  InventorySummary({
    required this.total,
    required this.lowStock,
    required this.fastMovers,
    required this.avgPrice,
  });

  final int total;
  final int lowStock;
  final int fastMovers;
  final double avgPrice;
}

const List<String> inventoryCategories = [
  'All',
  'Beverage',
  'Snack',
  'Fresh',
  'Household',
  'Grocery',
  'Pantry',
];

List<InventoryItem> buildInventory() {
  final random = Random(1337);
  const brands = [
    'Northwind',
    'Bluebird',
    'Harbor',
    'Summit',
    'Daybreak',
    'Field',
  ];
  const descriptors = [
    'Crisp',
    'Cold',
    'Bright',
    'Roasted',
    'Silky',
    'Bold',
    'Golden',
  ];
  const products = [
    'Latte',
    'Soda',
    'Granola',
    'Olive Oil',
    'Pasta',
    'Trail Mix',
    'Sparkling',
    'Juice',
    'Soap',
    'Oats',
    'Tea',
    'Coffee',
    'Yogurt',
    'Rice',
    'Chips',
  ];

  String pick(List<String> values) => values[random.nextInt(values.length)];

  return List.generate(1200, (index) {
    final name = '${pick(brands)} ${pick(descriptors)} ${pick(products)}';
    final price = double.parse(
      (2.5 + random.nextDouble() * 27.75).toStringAsFixed(2),
    );
    final stock = 5 + random.nextInt(140);
    final velocity = 20 + random.nextInt(80);
    final category =
        inventoryCategories[1 + random.nextInt(inventoryCategories.length - 1)];

    return InventoryItem(
      id: 'sku-${index + 1}',
      name: name,
      category: category,
      price: price,
      stock: stock,
      velocity: velocity,
      trendUp: velocity > 60,
    );
  });
}

InventorySummary summarizeInventory(List<InventoryItem> items) {
  var sumPrice = 0.0;
  var lowStock = 0;
  var fastMovers = 0;

  for (final item in items) {
    sumPrice += item.price;
    if (item.stock < 20) {
      lowStock += 1;
    }
    if (item.velocity > 70) {
      fastMovers += 1;
    }
  }

  return InventorySummary(
    total: items.length,
    lowStock: lowStock,
    fastMovers: fastMovers,
    avgPrice: sumPrice / items.length,
  );
}
