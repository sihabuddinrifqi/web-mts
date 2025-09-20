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

        /* Header (kop surat) */
        .header-table {
            width: 100%;
            border-bottom: 3px double black;
            margin-bottom: 15px;
        }
        .header-table td {
            vertical-align: middle;
            text-align: center;
        }
        .header-logo {
            width: 110px;
            text-align: left;
        }
        .header-logo img {
            width: 100px;
            height: 100px;
        }
        .header-text {
            text-align: center;
        }
        .madrasah {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .pondok {
            font-size: 16px;
            font-weight: bold;
        }
        .address, .contact, .nsm-npsn {
            font-size: 11px;
        }

        /* Title & info */
        .main-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin: 20px 0 10px 0;
        }
        .subtitle {
            font-size: 12px;
            margin-bottom: 5px;
            text-align: center;
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

        /* Status warna */
        .status-hadir { background-color: #d4edda; color: #155724; font-weight: bold; }
        .status-sakit { background-color: #fff3cd; color: #856404; font-weight: bold; }
        .status-izin  { background-color: #d1ecf1; color: #0c5460; font-weight: bold; }
        .status-alpha { background-color: #f8d7da; color: #721c24; font-weight: bold; }

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

        /* TTD */
        .ttd {
            width: 100%;
            margin-top: 50px;
        }
        .ttd td {
            vertical-align: top;
            text-align: center;
            width: 50%;
        }
        .ttd .right {
            text-align: right;
            padding-right: 50px;
        }
    </style>
</head>
<body>
    <!-- Kop Surat -->
    <table class="header-table">
        <tr>
            <td class="header-logo">
                <img src="{{ public_path('logo.png') }}" alt="Logo Madrasah">
            </td>
            <td class="header-text">
                <div class="madrasah">MADRASAH TSANAWIYAH</div>
                <div class="pondok">"ASH – SHOLIHIN"</div>
                <div class="address">
                    Jl. Kyai Ilyas No. 17A, Dusun Longkrang, Desa Sukomulyo, Kec. Watumalang, Kab. Wonosobo
                </div>
                <div class="contact">
                    WA : 0823 3184 8872 | Email : mtsashsholihin@gmail.com
                </div>
                <div class="nsm-npsn">
                    NSM : 121233070051 &nbsp;&nbsp; NPSN : 70044220
                </div>
            </td>
        </tr>
    </table>

    <!-- Title -->
    <div class="main-title">{{ $title }}</div>
    <div class="subtitle">{{ $pelajaran_name }}</div>
    <div class="subtitle">Periode: {{ $periode }}</div>

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
            <tr><td>Hadir (H)</td><td>{{ $summary['hadir'] }}</td></tr>
            <tr><td>Sakit (S)</td><td>{{ $summary['sakit'] }}</td></tr>
            <tr><td>Izin (I)</td><td>{{ $summary['izin'] }}</td></tr>
            <tr><td>Alpha (A)</td><td>{{ $summary['alpha'] }}</td></tr>
            <tr style="font-weight: bold; background-color: #f0f0f0;">
                <td>Total</td><td>{{ $summary['total'] }}</td>
            </tr>
        </tbody>
    </table>

    <!-- Bagian Tanda Tangan -->
    <table class="ttd">
        <tr>
            <td></td>
            <td class="right">
                Wonosobo, {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}<br>
                Wali Kelas<br><br><br><br>
                <u>{{ $walikelas['name'] ?? '________________' }}</u><br>
                NIP. {{ $walikelas['nip'] ?? '__________' }}
            </td>
        </tr>
    </table>
</body>
</html>
