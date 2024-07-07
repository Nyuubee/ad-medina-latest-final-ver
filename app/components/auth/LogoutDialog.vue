<template>
   <dialog class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Are you sure you want to log out?</h3>
        <p class="py-4">Press ESC key or click the button below to close</p>
        <div class="modal-action items-center">
          <form method="dialog" class="join flex justify-center gap-x-6 w-full">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn btn-error" @click="signOut({
              callbackUrl: '/login',
            })">
              <Icon name="material-symbols:logout"></Icon>
              Log out
            </button>
            <button class="btn btn-success">Cancel</button>
          </form>
        </div>
      </div>
    </dialog>
</template>
<script setup lang="ts">
const {signOut} = useAuth()
</script>
