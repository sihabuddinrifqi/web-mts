<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        /* Use a font that supports a wide range of characters */
        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
        }
        
        /* Header styling */
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .main-title {
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 12px;
            margin-bottom: 5px;
        }
        .date-info {
            font-size: 10px;
            text-align: right;
            margin-bottom: 20px;
        }

        /* Presensi table */
        .presensi-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .presensi-table th, .presensi-table td {
            border: 1px solid black;
            padding: 4px;
            text-align: center;
            font-size: 10px;
        }
        .presensi-table th {
            background-color: #e9e9e9;
            font-weight: bold;
        }
        .presensi-table td:first-child,
        .presensi-table td:nth-child(2) {
            text-align: left;
        }
        
        /* Status styling */
        .status-hadir {
            background-color: #d4edda;
            color: #155724;
            font-weight: bold;
        }
        .status-sakit {
            background-color: #fff3cd;
            color: #856404;
            font-weight: bold;
        }
        .status-izin {
            background-color: #d1ecf1;
            color: #0c5460;
            font-weight: bold;
        }
        .status-alpha {
            background-color: #f8d7da;
            color: #721c24;
            font-weight: bold;
        }
        
        /* Summary table */
        .summary-table {
            width: 50%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .summary-table th, .summary-table td {
            border: 1px solid black;
            padding: 4px;
            text-align: left;
        }
        .summary-table th {
            background-color: #e9e9e9;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="main-title">{{ $title }}</div>
        <div class="subtitle">{{ $pelajaran_name }}</div>
        <div class="subtitle">Periode: {{ $periode }}</div>
    </div>

    <div class="date-info">
        <p>Tanggal Cetak: {{ $print_date }}</p>
    </div>

    <!-- Presensi Table -->
    <table class="presensi-table">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 15%;">NIS</th>
                <th style="width: 25%;">Nama Siswa</th>
                @foreach($dates as $date)
                <th style="width: 8%;">{{ $date }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($presensi_data as $index => $siswa)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $siswa['nis'] }}</td>
                <td>{{ $siswa['name'] }}</td>
                @foreach($dates as $date)
                <td class="status-{{ $siswa['presensi'][$date] ?? 'alpha' }}">
                    @if(isset($siswa['presensi'][$date]))
                        @if($siswa['presensi'][$date] === 'hadir') H
                        @elseif($siswa['presensi'][$date] === 'sakit') S
                        @elseif($siswa['presensi'][$date] === 'izin') I
                        @else A
                        @endif
                    @else
                        -
                    @endif
                </td>
                @endforeach
            </tr>
            @empty
            <tr>
                <td colspan="{{ count($dates) + 3 }}" style="text-align: center;">Belum ada data presensi.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Summary Table -->
    <table class="summary-table">
        <thead>
            <tr>
                <th>Keterangan</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Hadir (H)</td>
                <td>{{ $summary['hadir'] }}</td>
            </tr>
            <tr>
                <td>Sakit (S)</td>
                <td>{{ $summary['sakit'] }}</td>
            </tr>
            <tr>
                <td>Izin (I)</td>
                <td>{{ $summary['izin'] }}</td>
            </tr>
            <tr>
                <td>Alpha (A)</td>
                <td>{{ $summary['alpha'] }}</td>
            </tr>
            <tr style="font-weight: bold; background-color: #f0f0f0;">
                <td>Total</td>
                <td>{{ $summary['total'] }}</td>
            </tr>
        </tbody>
    </table>

</body>
</html>