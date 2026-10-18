<?php

use App\Models\Lead;

it('creates a lead', function () {
    $this->post(route('leads.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'status' => 'new',
    ]);

    expect(Lead::query()->count())->toBe(1);
});

it('flashes an Inertia toast after creating a lead', function () {
    $response = $this->post(route('leads.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'status' => 'new',
    ]);

    $response
        ->assertRedirect(route('leads.index'))
        ->assertInertiaFlash('type', 'success')
        ->assertInertiaFlash('message', 'Lead created successfully.');
});

it('rejects invalid lead data', function () {
    $this->post(route('leads.store'), [
        'name' => '',
        'email' => 'not-an-email',
        'status' => 'bogus',
    ])->assertSessionHasErrors(['name', 'email', 'status']);

    expect(Lead::query()->count())->toBe(0);
});
