import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { testimonialFields } from "@/components/admin/fields";
import { Route as AdminRoute } from "./admin";

export const Route = createFileRoute("/admin/testimonials")({
  component: Page,
});

function Page() {
  const { state } = AdminRoute.useLoaderData();
  if (!state) return null;
  return (
    <CrudPage
      title="Testimonials"
      collection="testimonials"
      rows={state.testimonials as unknown as Record<string, unknown>[]}
      fields={testimonialFields}
      columns={[
        { key: "name", label: "Name" },
        { key: "course", label: "Course" },
        { key: "rating", label: "Rating" },
        { key: "featured", label: "Featured" },
        { key: "published", label: "Published" },
      ]}
      defaults={{
        name: "",
        course: "",
        level: "O Level",
        rating: 5,
        initials: "",
        text: "",
        image: "",
        featured: true,
        published: true,
        sortOrder: state.testimonials.length,
      }}
    />
  );
}
