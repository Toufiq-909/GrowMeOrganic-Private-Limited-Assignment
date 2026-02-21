import { useState, useEffect, useRef } from 'react';
import { z } from "zod";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

type ArticleData = {
    title: string,
    id: number,
    place_of_origin: string,
    artist_display: string,
    inscriptions: string,
    date_start: number,
    date_end: number
}

export default function App() {
    const [page, setpage] = useState<number>(1);
    const [rows, setrows] = useState<ArticleData[]>([]);
    const [first, setfirst] = useState<number>(1);
    const [last, setlast] = useState<number>(12);
    const [selectedRows, setSelectedRows] = useState<ArticleData[]>([]);
    const [loader, setloader] = useState<boolean>(true);

    // --- new states ---
    const [bulkInput, setBulkInput] = useState<string>("");
    const [targetCount, setTargetCount] = useState<number>(0);
    const [manualDeselected, setManualDeselected] = useState<Set<number>>(new Set());
    const overlayRef = useRef<OverlayPanel>(null);
    // ------------------

    const totalrecords = 130023;

    // Decides which rows on current page should be checked — pure math, no API call
    const computeSelectedRows = (fetchedRows: ArticleData[]) => {
        return fetchedRows.filter((row, localIndex) => {
            const globalIndex = (page - 1) * 12 + localIndex;
            return globalIndex < targetCount && !manualDeselected.has(row.id);
        });
    };

    useEffect(() => {
        setloader(true);
        window.scrollTo(0, 0);

        let fetchdata = async () => {
            let response = await fetch("https://api.artic.edu/api/v1/artworks?page=" + page);
            let responseData = await response.json();

            const rowschema = z.object({
                title: z.string().nullable(),
                place_of_origin: z.string().nullable(),
                artist_display: z.string().nullable(),
                inscriptions: z.string().nullable(),
                date_start: z.number().nullable(),
                date_end: z.number().nullable(),
                id: z.number()
            });

            let arrayOfRowsSchema = z.array(rowschema);
            let result2 = arrayOfRowsSchema.parse(responseData.data);

            result2 = result2.map((curr) => {
                if (!curr.date_start) curr.date_start = -1;
                if (!curr.date_end) curr.date_end = -1;
                if (!curr.inscriptions) curr.inscriptions = "N/A";
                if (!curr.artist_display) curr.artist_display = "N/A";
                if (!curr.place_of_origin) curr.place_of_origin = "N/A";
                return curr;
            });

            let data: ArticleData[] = result2 as ArticleData[];
            setloader(false);
            setrows(data);
            setSelectedRows(computeSelectedRows(data)); // auto-check rows based on targetCount
            setfirst(12 * (page - 1) + 1);
            setlast(12 * page);
        };

        fetchdata();
    }, [page, targetCount, manualDeselected]); // re-run when any of these change

    // When user clicks Select button — just saves the number, no API call
    const handleBulkSelect = () => {
        const count = parseInt(bulkInput);
        if (isNaN(count) || count <= 0) return;
        overlayRef.current?.hide();
        setTargetCount(count);
        setManualDeselected(new Set()); // reset manual unchecks for fresh selection
        setBulkInput("");
    };

    // Total selected count across all pages (calculated logically, not from array)
    const totalSelected =
        Math.max(0, targetCount - manualDeselected.size) +
        selectedRows.filter((r) => {
            const localIndex = rows.findIndex((row) => row.id === r.id);
            const globalIndex = (page - 1) * 12 + localIndex;
            return globalIndex >= targetCount; // rows checked outside bulk range
        }).length;

    // Custom header with chevron icon + overlay popup
    const customSelection = () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
                className="pi pi-chevron-down"
                style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                onClick={(e) => overlayRef.current?.toggle(e)}
            />
            <OverlayPanel ref={overlayRef} style={{ width: '300px' }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Select Multiple Rows</p>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: '4px 0 10px 0' }}>
                    Enter number of rows to select across all pages
                </p>
                <div style={{ display: 'flex flex-direction:column', gap: '8px' }}>
                    <InputText
                        value={bulkInput}
                        onChange={(e) => setBulkInput(e.target.value)}
                        placeholder="e.g., 20"
                        style={{ flex: 1 }}
                        onKeyDown={(e) => e.key === 'Enter' && handleBulkSelect()}
                    />
                    <Button
                        label="Select"
                        onClick={handleBulkSelect}
                        style={{ backgroundColor: '#a78bfa', border: 'none' }}
                    />
                </div>
            </OverlayPanel>
        </div>
    );

    let currentPageReportTemplate = () => {
        return (
            <p>Showing <b>{first}</b> to <b>{last}</b> of <b>{totalrecords}</b> entries</p>
        );
    };

    let Navigation = () => {
        return (
            <div className={"flex gap-3"}>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" onClick={() => {
                    if (page != 1) setpage(prev => prev - 1);
                }}>Previous</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={() => setpage(1)}>1</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={() => setpage(2)}>2</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={() => setpage(3)}>3</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={() => setpage(4)}>4</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" size="small" onClick={() => setpage(5)}>5</Button>
                <Button className="!bg-white !border-1 !border-neutral-300 !text-black focus:!bg-blue-700 focus:!text-white" onClick={() => setpage(prev => prev + 1)}>Next</Button>
            </div>
        );
    };

    return (
        <div className="card">
            <p className={"text-neutral-400"}>Selected: <b>{totalSelected}</b> rows</p>
            <DataTable
                value={rows}
                loading={loader}
                loadingIcon="pi pi-spin pi-spinner"
                paginator
                rows={12}
                selectionMode="checkbox"
                selection={selectedRows}
                onSelectionChange={(e) => {
                    const newSelected = e.value as ArticleData[];
                    const currentPageIds = rows.map(r => r.id);
                    const newSelectedIds = new Set(newSelected.map(r => r.id));

                    // Track which bulk-selected rows the user manually unchecked
                    setManualDeselected(prev => {
                        const updated = new Set(prev);
                        currentPageIds.forEach((id, localIndex) => {
                            const globalIndex = (page - 1) * 12 + localIndex;
                            if (globalIndex < targetCount) {
                                if (!newSelectedIds.has(id)) {
                                    updated.add(id);    // user unchecked it
                                } else {
                                    updated.delete(id); // user re-checked it
                                }
                            }
                        });
                        return updated;
                    });

                    setSelectedRows(newSelected);
                }}
                paginatorLeft={currentPageReportTemplate()}
                paginatorRight={Navigation()}
                paginatorTemplate=""
            >
                <Column selectionMode="multiple" header={customSelection} headerStyle={{ width: '3rem' }} />
                <Column field="title" header="TITLE" className={"!font-bold"} />
                <Column field="place_of_origin" header="PLACE OF ORIGIN" />
                <Column field="artist_display" header="ARTIST" />
                <Column field="inscriptions" header="INSCRIPTIONS" />
                <Column field="date_start" header="START DATE" />
                <Column field="date_end" header="END DATE" />
            </DataTable>
        </div>
    );
}