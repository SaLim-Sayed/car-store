type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** يحقن بيانات Schema.org لتحسين ظهور النتائج العربية */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
