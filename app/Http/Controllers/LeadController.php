<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    public function index(): Response
    {
        $leads = Lead::latest()->get();

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:leads,email',
            'status' => 'required|in:new,engaged,proposal_sent,closed_won,closed_lost',
        ]);

        Lead::create($validated);

        // Inertia reads flash data from the `inertia.flash_data` session key,
        // not from Laravel's `->with()`, so the toast can be picked up by React.
        Inertia::flash([
            'type' => 'success',
            'message' => 'Lead created successfully.',
        ]);

        return redirect()->route('leads.index');
    }
}
