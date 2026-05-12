type JsonLdProps = {
  data: object | object[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD payload se construye server-side a partir de data tipada,
      // no de input de usuario. Sanitizamos </script> por defensa en profundidad.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
