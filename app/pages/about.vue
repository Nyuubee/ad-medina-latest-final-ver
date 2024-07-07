<template>
    <main>

        <Head>
            <Title>About</Title>
        </Head>
        <!-- About the company -->
        <section class="hero min-h-screen">
            <div class="hero-content text-center">
                <div class="max-w-lg">
                    <h1 class="text-5xl font-bold flex place-items-center">
                        <div class="avatar mr-4">
                            <div class="w-20 rounded-full">
                                <img src="/public/favicon-96.png"></img>
                            </div>
                        </div>
                        <span class="h-full">
                            AD Medina Clinic
                        </span>
                    </h1>
                    <p class="py-6 text-lg">Caring for your smile. One tooth at a time.</p>
                    <NuxtLink :to="{hash:'#contact-us-content'}" class="btn btn-primary">Contact US</NuxtLink>
                </div>
            </div>
        </section>
        <section class="hero min-h-screen" id="contact-us-content">
            <!-- Clinic address: "623 Herodotus St. Vista Verde Executive Village, Cainta, Rizal."
            Cell no. : 09693008750
            Clinic hours: Appointments only -->
            <div class="hero-content text-justify" >    
                <div class="max-w-lg">
                    <h1 class="text-5xl font-bold text-center">Contact Us</h1>
                    <p class="py-6 text-xl form-control gap-y-2">
                    <div>
                        <Icon name="material-symbols:home" class="text-2xl" />
                        Clinic address:
                    </div>
                    <div class="font-bold ml-4">
                        623 Herodotus St. Vista Verde Executive Village,<wbr> Cainta, Rizal.
                    </div>
                    <div>
                        <Icon name="material-symbols:call" class="text-2xl" />
                        Mobile number:
                        <span class="font-bold">
                            09693008750
                        </span>
                    </div>
                    <div>
                        <!-- Clinic hours: Appointments only -->
                        <Icon name="material-symbols:alarm" class="text-2xl" />
                        Clinic hours:
                        <span class="font-bold">
                            Appointments only
                        </span>
                    </div>
                    <!-- admedina197@gmail.com -->
                    <div>
                        <Icon name="material-symbols:mail" class="text-2xl" />
                        Email:
                        <address class="inline font-bold">
                        admedina197@gmail.com
                        </address>
                        </div>
                    </p>
                </div>
            </div>
        </section>
        <section class="hero min-h-screen">
            <!-- About the developers -->
            <!-- 3 column card layout in desktop -->
            <!-- 3 row in mobile -->
            <div class="hero-content text-center">
                <div class="max-w-5xl flex flex-col gap-y-8">
                    <h1 class="text-5xl font-bold">About the Developers</h1>
                    <div class="grid md:grid-cols-3 gap-y-4 md:gap-x-6">
                        <div class="card md:card-normal bg-base-200" v-for="dev of devs">
                            <figure class="px-10 pt-10 self-center max-w-80 md:w-full">
                                <img :src="dev.picture" :alt="`image of ${dev.name}`" />
                            </figure>
                            <div class="card-body items-center text-center">
                                <div class="card-title">{{ dev.name }} </div>
                                <div>{{ dev.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="hero min-h-screen">
            <div class="hero-content text-center flex flex-col">
                <h1 class="text-5xl font-bold">System Version</h1>
                <div v-for="l of libraries">
                    {{ l.name }} {{ l.version }}
                </div>
            </div>
        </section>
    </main>
</template>
<script setup lang="ts">
import packageJson from '~/package.json';
definePageMeta({
    layout: 'guest',
    auth: false
});

interface Dev {
    name: string;
    picture?: string;
    title: string;
}
const devs = ref<Dev[]>([
    {
        name: "Medina, Felipe Raphael D.",
        title: "Developer",
        picture: "/medina.png",
    },
    {
        name: "San Juan, Jean Carlo M.",
        title: "Lead Developer",
        picture: "/sanjuan.png",
    },
    {
        name: "Riza, Ron-nald Johnne C.",
        title: "Developer",
        picture: "/riza.jpg",
    },
])

interface Library {
    name: keyof typeof packageJson.devDependencies | keyof typeof packageJson.dependencies | 'app';
    icon: string;
    version?: string;
}
const libraries: Library[] = [
    {
        name: "app",
        icon: '',
        version: '0.6.0'
    },
    {
        name: 'typescript',
        icon: 'typescript',
        version: packageJson.devDependencies.typescript,
    },
    {
        name: 'nuxt',
        icon: 'nuxt',
        version: packageJson.devDependencies.nuxt,
    },
    {
        name: 'drizzle-orm',
        icon: 'drizzle-orm',
        version: packageJson.dependencies['drizzle-orm'],
    }
]
</script>
