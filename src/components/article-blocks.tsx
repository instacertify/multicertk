import type { ArticleBlock } from "@/data/cms-seed";

const spacerClass = {
  sm: "h-4",
  md: "h-8",
  lg: "h-16",
};

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mt-8 space-y-4">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <p key={block.id} className="text-ink">
              {block.text}
            </p>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={block.id} className="overflow-hidden rounded-2xl border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.url} alt={block.alt || block.caption || ""} className="max-h-96 w-full object-cover" />
              {block.caption ? <figcaption className="caption px-3 py-2 text-muted">{block.caption}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "table") {
          const [head, ...rows] = block.rows;
          if (!head?.length) return null;
          return (
            <div key={block.id} className="overflow-x-auto rounded-2xl border border-line">
              {block.caption ? <p className="caption border-b border-line px-3 py-2 text-muted">{block.caption}</p> : null}
              <table className="w-full">
                <thead className="bg-paper">
                  <tr>
                    {head.map((cell) => (
                      <th key={cell} className="px-3 py-2 text-start font-semibold text-navy">
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${block.id}-${index}`} className="border-t border-line">
                      {row.map((cell, cellIndex) => (
                        <td key={`${block.id}-${index}-${cellIndex}`} className="px-3 py-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "bar") {
          const width = Math.max(0, Math.min(100, block.value));
          return (
            <div key={block.id}>
              <div className="mb-1 flex justify-between caption text-muted">
                <span>{block.label}</span>
                <span>{width}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-gold" style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        }
        return <div key={block.id} aria-hidden className={spacerClass[block.size]} />;
      })}
    </div>
  );
}
