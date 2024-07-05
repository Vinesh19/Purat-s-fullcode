<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class LanguagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('languages')->insert([
            ['id' => 1, 'language' => 'English (US)', 'short_name' => 'en_US'],
            ['id' => 2, 'language' => 'Telugu', 'short_name' => 'te'],
            ['id' => 3, 'language' => 'Tamil', 'short_name' => 'ta'],
            ['id' => 4, 'language' => 'Russian', 'short_name' => 'ru'],
            ['id' => 5, 'language' => 'Punjabi', 'short_name' => 'pa'],
            ['id' => 6, 'language' => 'Marathi', 'short_name' => 'mr'],
            ['id' => 7, 'language' => 'Malayalam', 'short_name' => 'ml'],
            ['id' => 8, 'language' => 'Hindi', 'short_name' => 'hi'],
            ['id' => 9, 'language' => 'Gujarati', 'short_name' => 'gu'],
            ['id' => 10, 'language' => 'Urdu', 'short_name' => 'ur'],
            ['id' => 11, 'language' => 'Bengali', 'short_name' => 'bn'],
            ['id' => 12, 'language' => 'Kannada', 'short_name' => 'kn'],
            ['id' => 13, 'language' => 'English (UK)', 'short_name' => 'en_GB'],
            ['id' => 14, 'language' => 'English', 'short_name' => 'en'],
            ['id' => 15, 'language' => 'Hebrew', 'short_name' => 'he'],
        ]);
    }
}
