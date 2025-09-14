<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', 'Helvetica', 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
        }
        .main-title {
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
        }
        .subtitle {
            font-size: 12px;
            margin-bottom: 5px;
        }
        .date-info {
            font-size: 10px;
            text-align: right;
            margin-bottom: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 4px;
            text-align: center;
            font-size: 10px;
        }
        th {
            background-color: #e9e9e9;
            font-weight: bold;
        }

        /* Status warna */
        .status-hadir { background-color: #d4edda; color: #155724; font-weight: bold; }
        .status-sakit { background-color: #fff3cd; color: #856404; font-weight: bold; }
        .status-izin  { background-color: #d1ecf1; color: #0c5460; font-weight: bold; }
        .status-alpha { background-color: #f8d7da; color: #721c24; font-weight: bold; }

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
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="main-title">{{ $title }}</div>
        <div class="subtitle">Nama: {{ $siswa->name }}</div>
        <div class="subtitle">NIS: {{ $siswa->nis }}</div>
    </div>

    <div class="date-info">
        <p>Tanggal Cetak: {{ $print_date }}</p>
    </div>

    <!-- Presensi Table -->
    <table>
        <thead>
            <tr>
                <th style="width: 10%;">No</th>
                <th style="width: 20%;">Tanggal</th>
                <th style="width: 20%;">Pelajaran</th>
                <th style="width: 20%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($siswa->presensi as $index => $p)
                <tr class="status-{{ $p->status }}">
                    <td>{{ $index + 1 }}</td>
                    <td>{{ \Carbon\Carbon::parse($p->tanggal)->format('d/m/Y') }}</td>
                    <td>{{ $p->pelajaran->nama_pelajaran ?? '-' }}</td>
                    <td>
                        @if($p->status === 'hadir') H
                        @elseif($p->status === 'sakit') S
                        @elseif($p->status === 'izin') I
                        @else A
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="4" style="text-align:center;">Belum ada data presensi.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Summary -->
    <table class="summary-table">
        <thead>
            <tr>
                <th>Keterangan</th>
                <th>Jumlah</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>Hadir (H)</td><td>{{ $summary['hadir'] }}</td></tr>
            <tr><td>Sakit (S)</td><td>{{ $summary['sakit'] }}</td></tr>
            <tr><td>Izin (I)</td><td>{{ $summary['izin'] }}</td></tr>
            <tr><td>Alpha (A)</td><td>{{ $summary['alpha'] }}</td></tr>
            <tr style="font-weight:bold;background:#f0f0f0;">
                <td>Total</td><td>{{ $summary['total'] }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
