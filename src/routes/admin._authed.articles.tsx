import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import {
  EntityManager,
  type ColumnConfig,
  type FieldConfig,
} from "@/components/admin/EntityManager";
import type { articles } from "@/db/schema";
import {
  articleInput,
  createArticle,
  deleteArticle,
  getArticleCategories,
  getArticles,
  updateArticle,
} from "@/functions/articles";
import { slugify } from "@/lib/slugify";
import { queryKeys } from "@/services/api";

export const Route = createFileRoute("/admin/_authed/articles")({
  component: ArticlesAdminPage,
});

type ArticleRow = typeof articles.$inferSelect;

// The slug is auto-generated from the title and isn't shown in the form, so
// the form-level schema must not require it.
const articleFormSchema = articleInput.extend({ slug: z.string().optional() });
type ArticleValues = z.infer<typeof articleFormSchema>;

const columns: ColumnConfig<ArticleRow>[] = [
  { key: "title", label: "Titre" },
  { key: "category", label: "Catégorie" },
  { key: "author", label: "Auteur·rice" },
  { key: "date", label: "Date" },
];

function ArticlesAdminPage() {
  const categories = useQuery({
    queryKey: ["articles", "categories"],
    queryFn: () => getArticleCategories(),
  });

  const fields: FieldConfig[] = [
    { name: "title", label: "Titre", placeholder: "La renaissance des Afrobeats..." },
    {
      name: "category",
      label: "Catégorie",
      type: "combo",
      comboOptions: categories.data ?? [],
      placeholder: "Nouvelle catégorie",
    },
    { name: "author", label: "Auteur·rice", placeholder: "Awa Diarra" },
    { name: "date", label: "Date", type: "date" },
    { name: "readTime", label: "Temps de lecture", placeholder: "5 min" },
    { name: "cover", label: "Image de couverture", type: "url", accept: "image/*" },
    { name: "excerpt", label: "Extrait", type: "textarea", rows: 2 },
    {
      name: "body",
      label: "Corps de l'article (un paragraphe par ligne)",
      type: "lines",
      rows: 8,
    },
  ];

  return (
    <EntityManager<ArticleRow, ArticleValues>
      title="Kultu Webzine"
      description="Gérez les articles du magazine."
      queryKey={queryKeys.articles}
      listFn={() => getArticles()}
      createFn={(values) =>
        createArticle({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      updateFn={(values) =>
        updateArticle({ data: { ...values, slug: values.slug || slugify(values.title) } })
      }
      deleteFn={(values) => deleteArticle({ data: values })}
      schema={articleFormSchema}
      defaultValues={{
        slug: "",
        title: "",
        excerpt: "",
        body: [""],
        category: "",
        author: "",
        date: "",
        readTime: "",
        cover: "",
      }}
      fields={fields}
      columns={columns}
      getId={(row) => row.id}
      rowToValues={(row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        category: row.category,
        author: row.author,
        date: row.date,
        readTime: row.readTime,
        cover: row.cover,
      })}
    />
  );
}
