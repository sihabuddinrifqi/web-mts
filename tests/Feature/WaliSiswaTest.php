<?php

use App\Models\WaliSiswa;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

test('store method creates a new wali siswa', function () {
    // Arrange
    $password = 'randompassword'; // This will be mocked
    $username = 'walisiswa12345'; // This will be mocked
    
    // Mock Str::random and random_int
    Str::partialMock()
        ->shouldReceive('random')
        ->with(8)
        ->andReturn($password);
    
    // Mock random_int for username generation
    $mockRandomInt = mock('overload:random_int');
    $mockRandomInt->shouldReceive('random_int')
        ->with(10000, 99999)
        ->andReturn(12345);

    $data = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '081234567890',
        // other required fields from your WaliSiswaStoreRequest
    ];

    // Act
    $response = $this->post(route('admin.walisiswa.store'), $data);

    // Assert
    $response->assertRedirect(route('admin.walisiswa.index'));
    
    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '081234567890',
        'username' => $username,
        'role' => 'walisiswa',
    ]);
    
    $waliSiswa = WaliSiswa::first();
    $this->assertTrue(Hash::check($password, $waliSiswa->password));
    $this->assertEquals($password, $waliSiswa->first_password);
});

test('destroy method deletes a wali siswa', function () {
    // Arrange
    $waliSiswa = WaliSiswa::factory()->create();

    // Act
    $response = $this->delete(route('admin.walisiswa.destroy', $waliSiswa));

    // Assert
    $response->assertRedirect(route('admin.walisiswa.index'));
    $this->assertDatabaseMissing('users', ['id' => $waliSiswa->id]);
});

test('store method validates input', function () {
    // Act
    $response = $this->post(route('admin.walisiswa.store'), []);

    // Assert
    $response->assertInvalid([
        'name', // assuming these are required fields
        'email',
        'phone',
    ]);
});