import type { TypedRouteFromName } from "@typed-router/__router";
import { type RoutesNamesList } from "@typed-router/__routes"

export interface Page {
    current: number;
    perPage: number;
    count: number;
    get displayedNumber(): number;
    get offset(): number;
    next: () => void;
    prev: () => void;
    max: number;
}
/**
 * A Composable for handling pagination
 * @param source A ref with a count property 
 * @param perPage The number of items per page
 * @param initialCurrentPage The zero-based index of the initial page
 */
export function usePagination(source: Ref<{
    count: number
}>, perPage: number=GLOBAL_RECORDS_PER_PAGE_LIMIT,
    initialCurrentPage = 0) {
    const page = reactive<Page>({
        current: initialCurrentPage,
        perPage,
        count: source.value.count,
        /**
         * 1 based index of the current page
         */
        get displayedNumber() {
            return this.current + 1
        },
        /**
         * The offset of the current page
         * Formula: current * perPage
         */
        get offset() {
            return this.current * this.perPage
        },
        get max() {
            return maxPageNumber.value
        },
        next() {
            this.current = Math.min(maxPageNumber.value - 1, this.current + 1)
        },
        prev() {
            this.current = Math.max(0, this.current - 1)
        },
    })

    watch(source, source => {
        page.count = source.count;
    })

    const maxPageNumber = computed(() => {
        // min: 1
        const max =  Math.max(Math.ceil(source.value.count / page.perPage),1);
        if (isNaN(max)) {
            return 1
        }
        return max
    })

    const canNext = computed(() => page.current < maxPageNumber.value - 1)
    const canPrev = computed(() => page.current > 0)
    const offset = computed(() => page.offset)
    const limit = computed(() => page.perPage)
    return {
        page,
        max: maxPageNumber,
        canNext,
        canPrev,
        offset,
        limit,
    }
}

/**
 * Use this function to explicitly track changes to a query parameter
 *  @param routeName first argument of `useRoute`
 *  @param queryKey expands to `route.query.<key>`
 */
export function usePageControlFromQuery<R extends RoutesNamesList>(
    routeName:R,
    queryKey: keyof TypedRouteFromName<R>['query'],
    page:Page,
) {
    const route = useRoute(routeName)
    function currentPagefromQuery() {
        page.current = parseInt(route.query[queryKey] as string | undefined ?? "1") - 1
    }
    onMounted(currentPagefromQuery)
    watch(() => route.query[queryKey as string], currentPagefromQuery)
    function setPageQuery(n:number) {
        navigateTo({
            query: {
                ...route.query,
                [queryKey]: n
            }
        })
    }
    // watch page max, if current page is greater than max, set to max
    watch(page, () => {
        if (page.current >= page.max) {
            setPageQuery(page.max)
        }
    })

    function next() {
        setPageQuery(page.displayedNumber + 1)
    }

    function prev() {
        setPageQuery(page.displayedNumber - 1)
    }
    return {
        setPageQuery,
        next,
        prev
    }
}

export function defaultCount() {
    return {
        default() {
            return {
                count:0
            }
        }
    }
}
