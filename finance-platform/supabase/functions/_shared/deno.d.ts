declare namespace Deno {
    function serve(handler: (req: Request) => Response | Promise<Response>): void;
    const env: {
        get(key: string): string | undefined;
    };
}

// Deno's "jsr:" import specifier isn't understood by tsc's module
// resolution outside Deno's own toolchain — this just quiets the editor,
// the actual types come from Deno at deploy/run time.
declare module "jsr:@supabase/supabase-js@2" {
    export * from "@supabase/supabase-js";
}