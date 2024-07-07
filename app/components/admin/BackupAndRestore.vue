<template>
    <div>
        <h2 class="text-xl">Backup and Restore</h2>
        <div class="join">
        <!-- Backup -->
        <button class="join-item btn btn-sm btn-primary" onclick="backup.showModal()">
            <Icon name="material-symbols:backup" class="w-5 h-5" />
            Backup
        </button>
        <!-- Restore -->
        <button class="join-item btn btn-sm btn-primary" onclick="restore.showModal()">
            <Icon name="material-symbols:settings-backup-restore-rounded" class="w-5 h-5" />
            Restore
        </button>
        </div>
        <BackupDialog id="backup" />
        <RestoreDialog id="restore" />
    </div>
</template>
<script setup lang="ts">
import BackupDialog from './BackupDialog.vue';
import RestoreDialog from './RestoreDialog.vue';
</script>
