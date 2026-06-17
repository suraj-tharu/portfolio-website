/**
 * Utility for Dynamic Resume Export
 * Suggestion #20: Dynamic Resume Export
 */

export interface ResumeData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    experience: Array<{
        title: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    education: Array<{
        degree: string;
        institution: string;
        year: string;
    }>;
    skills: Array<{
        category: string;
        items: string[];
    }>;
    certifications: Array<{
        name: string;
        issuer: string;
        date: string;
    }>;
}

// Export to PDF
export const exportToPDF = async (resumeData: ResumeData) => {
    try {
        // Using a library like jsPDF - optional dependency
        let jsPDF: any;
        try {
            // @ts-ignore - jsPDF is optional dependency
            const module = await import('jspdf');
            jsPDF = module.jsPDF;
        } catch (e) {
            alert('jsPDF library not installed. Install with: npm install jspdf');
            return;
        }

        const doc = new jsPDF();

        let yPosition = 20;
        const lineHeight = 8;
        const pageHeight = doc.internal.pageSize.getHeight();

        // Helper to add text with page break
        const addTextWithPageBreak = (text: string, options: any = {}) => {
            if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(text, 20, yPosition, options);
            yPosition += lineHeight + (options.spacing || 0);
        };

        // Header
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        addTextWithPageBreak(resumeData.fullName);

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        addTextWithPageBreak(`${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`);

        // Summary
        if (resumeData.summary) {
            yPosition += 5;
            doc.setFont(undefined, 'bold');
            addTextWithPageBreak('PROFESSIONAL SUMMARY');
            doc.setFont(undefined, 'normal');
            addTextWithPageBreak(resumeData.summary, { maxWidth: 170, spacing: 3 });
        }

        // Experience
        if (resumeData.experience.length > 0) {
            yPosition += 5;
            doc.setFont(undefined, 'bold');
            addTextWithPageBreak('PROFESSIONAL EXPERIENCE');
            doc.setFont(undefined, 'normal');

            resumeData.experience.forEach(exp => {
                doc.setFont(undefined, 'bold');
                addTextWithPageBreak(`${exp.title} - ${exp.company}`);
                doc.setFont(undefined, 'normal');
                addTextWithPageBreak(`${exp.startDate} - ${exp.endDate}`, { fontSize: 9 });
                addTextWithPageBreak(exp.description, { maxWidth: 170 });
                yPosition += 3;
            });
        }

        // Education
        if (resumeData.education.length > 0) {
            yPosition += 5;
            doc.setFont(undefined, 'bold');
            addTextWithPageBreak('EDUCATION');
            doc.setFont(undefined, 'normal');

            resumeData.education.forEach(edu => {
                doc.setFont(undefined, 'bold');
                addTextWithPageBreak(edu.degree);
                doc.setFont(undefined, 'normal');
                addTextWithPageBreak(`${edu.institution}, ${edu.year}`);
                yPosition += 3;
            });
        }

        // Skills
        if (resumeData.skills.length > 0) {
            yPosition += 5;
            doc.setFont(undefined, 'bold');
            addTextWithPageBreak('SKILLS');
            doc.setFont(undefined, 'normal');

            resumeData.skills.forEach(skillGroup => {
                doc.setFont(undefined, 'bold');
                addTextWithPageBreak(`${skillGroup.category}:`);
                doc.setFont(undefined, 'normal');
                addTextWithPageBreak(skillGroup.items.join(', '), { maxWidth: 170 });
            });
        }

        // Certifications
        if (resumeData.certifications.length > 0) {
            yPosition += 5;
            doc.setFont(undefined, 'bold');
            addTextWithPageBreak('CERTIFICATIONS');
            doc.setFont(undefined, 'normal');

            resumeData.certifications.forEach(cert => {
                doc.setFont(undefined, 'bold');
                addTextWithPageBreak(cert.name);
                doc.setFont(undefined, 'normal');
                addTextWithPageBreak(`${cert.issuer}, ${cert.date}`);
                yPosition += 2;
            });
        }

        doc.save(`resume-${resumeData.fullName.replace(' ', '-')}.pdf`);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Failed to export PDF. Please try again.');
    }
};

// Export to Word
export const exportToWord = async (resumeData: ResumeData) => {
    try {
        // Using a library like docx - optional dependency
        let docxModules: any;
        try {
            // @ts-ignore - docx is optional dependency
            docxModules = await import('docx');
        } catch (e) {
            alert('docx library not installed. Install with: npm install docx');
            return;
        }

        const { Document, Packer, Paragraph, HeadingLevel } = docxModules;

        const sections = [];

        // Header
        sections.push(
            new Paragraph({
                text: resumeData.fullName,
                heading: HeadingLevel.HEADING_1
            }),
            new Paragraph({
                text: `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`
            })
        );

        // Summary
        if (resumeData.summary) {
            sections.push(
                new Paragraph({
                    text: 'PROFESSIONAL SUMMARY',
                    heading: HeadingLevel.HEADING_2
                }),
                new Paragraph(resumeData.summary)
            );
        }

        // Experience
        if (resumeData.experience.length > 0) {
            sections.push(
                new Paragraph({
                    text: 'PROFESSIONAL EXPERIENCE',
                    heading: HeadingLevel.HEADING_2
                })
            );

            resumeData.experience.forEach(exp => {
                sections.push(
                    new Paragraph({
                        text: `${exp.title} - ${exp.company}`,
                        bold: true
                    }),
                    new Paragraph(`${exp.startDate} - ${exp.endDate}`),
                    new Paragraph(exp.description)
                );
            });
        }

        // Education
        if (resumeData.education.length > 0) {
            sections.push(
                new Paragraph({
                    text: 'EDUCATION',
                    heading: HeadingLevel.HEADING_2
                })
            );

            resumeData.education.forEach(edu => {
                sections.push(
                    new Paragraph({
                        text: edu.degree,
                        bold: true
                    }),
                    new Paragraph(`${edu.institution}, ${edu.year}`)
                );
            });
        }

        // Skills
        if (resumeData.skills.length > 0) {
            sections.push(
                new Paragraph({
                    text: 'SKILLS',
                    heading: HeadingLevel.HEADING_2
                })
            );

            resumeData.skills.forEach(skillGroup => {
                sections.push(
                    new Paragraph({
                        text: `${skillGroup.category}: ${skillGroup.items.join(', ')}`,
                        bold: true
                    })
                );
            });
        }

        const doc = new Document({ sections: [{ children: sections }] });
        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${resumeData.fullName.replace(' ', '-')}.docx`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting Word:', error);
        alert('Failed to export Word document. Please try again.');
    }
};

// Export as JSON
export const exportAsJSON = (resumeData: ResumeData) => {
    const jsonString = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.fullName.replace(' ', '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// ATS-optimized plain text export
export const exportAsATS = (resumeData: ResumeData) => {
    let text = `${resumeData.fullName}\n`;
    text += `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}\n\n`;

    if (resumeData.summary) {
        text += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    }

    if (resumeData.experience.length > 0) {
        text += `PROFESSIONAL EXPERIENCE\n`;
        resumeData.experience.forEach(exp => {
            text += `${exp.title} - ${exp.company}\n`;
            text += `${exp.startDate} - ${exp.endDate}\n`;
            text += `${exp.description}\n\n`;
        });
    }

    if (resumeData.education.length > 0) {
        text += `EDUCATION\n`;
        resumeData.education.forEach(edu => {
            text += `${edu.degree}\n`;
            text += `${edu.institution}, ${edu.year}\n`;
        });
    }

    if (resumeData.skills.length > 0) {
        text += `\nSKILLS\n`;
        resumeData.skills.forEach(skillGroup => {
            text += `${skillGroup.category}: ${skillGroup.items.join(', ')}\n`;
        });
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-${resumeData.fullName.replace(' ', '-')}-ats.txt`;
    a.click();
    URL.revokeObjectURL(url);
};
