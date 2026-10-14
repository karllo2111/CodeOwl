<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $userRole = Role::firstOrCreate(['name' => 'user']);
        $editorRole = Role::firstOrCreate(['name' => 'content_editor']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
    }
}
