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
            font-size: 12px;
            line-height: 1.4;
        }
        /* Header table for logo and university details */
        .header-table {
            width: 100%;
            border-bottom: 2px solid black;
            padding-bottom: 10px;
            margin-bottom: 2px;
        }
        .header-table td {
            vertical-align: middle;
            text-align: center;
        }
        .logo {
            width: 80px;
            height: 80px;
        }
        .university-title {
            font-size: 16px;
            font-weight: bold;
        }
        .faculty-title {
            font-size: 14px;
            font-weight: bold;
        }
        .address {
            font-size: 10px;
        }

        /* Main content styling */
        .content {
            width: 100%;
            margin-top: 20px;
        }
        .main-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            text-decoration: underline;
            margin-bottom: 20px;
        }

        /* Student info table */
        .info-table {
            width: 60%; /* Adjust as needed */
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 2px 5px;
        }

        /* Grades table */
        .grades-table {
            width: 100%;
            border-collapse: collapse;
        }
        .grades-table th, .grades-table td {
            border: 1px solid black;
            padding: 6px;
            text-align: left;
        }
        .grades-table th {
            background-color: #e9e9e9;
            text-align: center;
        }
        .text-center {
            text-align: center;
        }
        .footer-row td {
            font-weight: bold;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="content">
        <div class="main-title">TRANSKRIP NILAI</div>

        <!-- Student Information -->
        <table class="info-table">
            <tr>
                <td style="width: 30%;">Nama</td>
                <td style="width: 5%;">:</td>
                <td style="width: 65%;">{{ $student['name'] }}</td>
            </tr>
            <tr>
                <td>NIS</td>
                <td>:</td>
                <td>{{ $student['nis'] }}</td>
            </tr>
            <tr>
                <td>Tempat/Tgl Lahir</td>
                <td>:</td>
                <td>{{ $student['birth_info'] }}</td>
            </tr>
            <tr>
                <td>Jenis Kelamin</td>
                <td>:</td>
                <td>{{ $student['gender'] }}</td>
            </tr>
        </table>

        <!-- Grades Table -->
        <table class="grades-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 35%;">Pelajaran</th>
                    <th style="width: 45%;">Semester</th>
                    <th style="width: 15%;">Nilai</th>
                </tr>
            </thead>
            <tbody>
                @foreach($subjects as $index => $subject)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $subject['name'] }}</td>
                    <td>{{ $subject['semester'] }}</td>
                    <td class="text-center">{{ $subject['score'] }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr class="footer-row">
                    <td colspan="3">Rata - Rata</td>
                    <td class="text-center">{{ $average }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

</body>
</html>
