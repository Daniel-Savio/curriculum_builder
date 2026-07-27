import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { EasyResumeFormData } from "@/lib/easy-resume-schema";

// Mesmo padrão visual do pdf-resume.tsx, mas sem separar experiência/formação
// e sem exigir campos que o formulário simplificado não obriga a preencher.
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    color: "#333",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    backgroundColor: "#e0f2fe",
    padding: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#0369a1",
  },
  role: {
    fontSize: 14,
    color: "#0284c7",
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: "#475569",
    flexDirection: "row",
    gap: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0369a1",
    textTransform: "uppercase",
    borderBottom: "2px solid #fef9c3",
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  entryMeta: {
    fontSize: 10,
    color: "#666",
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillItem: {
    fontSize: 11,
    backgroundColor: "#fef9c3",
    color: "#854d0e",
    padding: "4px 8px",
    borderRadius: 4,
  },
});

export function EasyResumePDF({ data }: { data: EasyResumeFormData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.fullName}</Text>
          {data.role && <Text style={styles.role}>{data.role}</Text>}
          <View style={styles.contact}>
            {data.hasNoPhone ? (
              <Text>
                Recado com {data.alternateContactName}: {data.alternateContactPhone}
              </Text>
            ) : (
              <Text>{data.phone}</Text>
            )}
            <Text>{data.city}</Text>
          </View>
        </View>

        {data.generalDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.text}>{data.generalDescription}</Text>
          </View>
        )}

        {data.highlights && data.highlights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experiências e Formação</Text>
            {data.highlights.map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{item.title}</Text>
                  {item.date && <Text style={styles.entryMeta}>{item.date}</Text>}
                </View>
                {item.description && <Text style={styles.text}>{item.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.skillContainer}>
              {data.skills.map((skill, index) => (
                <Text key={index} style={styles.skillItem}>
                  {skill.value}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
