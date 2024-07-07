ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "supply_categories" ADD CONSTRAINT "supply_categories_name_unique" UNIQUE("name");