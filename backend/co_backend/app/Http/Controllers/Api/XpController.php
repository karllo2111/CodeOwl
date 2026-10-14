<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\XpTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class XpController extends Controller
{
    /**
     * Get user total XP and level details.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'total_xp' => (int) $user->total_xp,
            'current_level' => (int) $user->current_level,
        ]);
    }

    /**
     * Paginated XP transaction history with human-readable reasons.
     */
    public function history(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $transactions = $user->xpTransactions()
            ->latest()
            ->paginate(15);

        $mapped = $transactions->getCollection()->map(function (XpTransaction $tx) {
            $reason = $tx->metadata['reason'] ?? $this->formatSourceReason($tx);

            return [
                'id' => $tx->id,
                'amount' => (int) $tx->amount,
                'source_type' => $tx->source_type,
                'reason' => $reason,
                'created_at' => $tx->created_at,
            ];
        });

        return response()->json([
            'data' => $mapped,
            'current_page' => $transactions->currentPage(),
            'last_page' => $transactions->lastPage(),
            'total' => $transactions->total(),
        ]);
    }

    protected function formatSourceReason(XpTransaction $tx): string
    {
        return match ($tx->source_type) {
            'lesson_completion' => 'Menyelesaikan materi pembelajaran',
            'challenge_passed' => 'Menyelesaikan tantangan kode',
            'streak_milestone' => 'Bonus konsistensi streak',
            'achievement' => 'Membuka pencapaian baru',
            'welcome_bonus' => 'Bonus selamat datang',
            default => 'Mendapatkan poin XP',
        };
    }
}
