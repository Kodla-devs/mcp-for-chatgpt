import { createMcpHandler } from "mcp-handler";
import { server } from "typescript";

const handler = createMcpHandler(
    (server) => {
        server.tool(
            'time_now',
            'Returns the current time in Istanbul (Europe/Istanbul timezone)',
            {},
            async ()=> {
                const now = new Date();
                const options = {
                    timeZone: 'Europe/Istanbul',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                };
                const timeString = now.toLocaleString('tr-TR', options);

                return {
                    content: [{type: 'text', text: `Şu an İstanbul saatiyle: ${timeString}`}]
                };
            }
        );
    },
    {},
    {basePath: '/api'}
);

export {handler as GET, handler as POST, handler as DELETE};