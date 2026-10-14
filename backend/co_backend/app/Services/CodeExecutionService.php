<?php

namespace App\Services;

class CodeExecutionService
{
    public function execute(string $code, string $language, int $timeoutSeconds = 10, int $memoryMb = 128, ?string $testCode = null): array
    {
        $sandboxDir = storage_path('app/sandbox');
        if (!is_dir($sandboxDir)) {
            mkdir($sandboxDir, 0755, true);
        }

        $id = uniqid();
        $codeFile = $sandboxDir . "/code_{$id}.js";
        file_put_contents($codeFile, $code);

        $testFile = '';
        if ($testCode) {
            $testFile = $sandboxDir . "/test_{$id}.js";
            file_put_contents($testFile, $testCode);
        }

        $runner = $sandboxDir . '/sandbox_runner.cjs';
        
        $cmd = "timeout {$timeoutSeconds} nice -n 19 node --max-old-space-size={$memoryMb} {$runner} {$codeFile} {$testFile} 2>&1";
        
        exec($cmd, $output, $exitCode);
        
        @unlink($codeFile);
        if ($testFile) @unlink($testFile);

        $outputStr = implode("\n", $output);
        $result = json_decode($outputStr, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($result)) {
            return $result;
        }

        return [
            'success' => $exitCode === 0,
            'output' => $outputStr,
            'error' => $exitCode !== 0 ? 'Execution failed or timed out' : null,
            'executionTimeMs' => null,
            'tests' => []
        ];
    }
}
