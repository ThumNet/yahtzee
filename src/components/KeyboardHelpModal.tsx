import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize } from '../utils/constants';

interface KeyboardHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

interface KeyBindingProps {
  keys: string[];
  description: string;
}

function KeyBinding({ keys, description }: KeyBindingProps) {
  return (
    <View style={styles.bindingRow}>
      <View style={styles.keysContainer}>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <View style={styles.keyBox}>
              <Text style={styles.keyText}>{key}</Text>
            </View>
            {index < keys.length - 1 && <Text style={styles.orText}>/</Text>}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.descriptionText}>{description}</Text>
    </View>
  );
}

export function KeyboardHelpModal({ visible, onClose }: KeyboardHelpModalProps) {
  // Don't render on non-web platforms
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modal}>
              <Text style={styles.title}>KEYBOARD CONTROLS</Text>
              
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dice</Text>
                <KeyBinding keys={['Space']} description="Roll dice" />
                <KeyBinding keys={['1', '2', '3', '4', '5']} description="Toggle hold on die" />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Scorecard</Text>
                <KeyBinding keys={['↑', '↓']} description="Navigate categories" />
                <KeyBinding keys={['Enter']} description="Confirm selection" />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other</Text>
                <KeyBinding keys={['M']} description="Toggle mute" />
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    minWidth: 320,
    maxWidth: 400,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: 2,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bindingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    justifyContent: 'space-between',
  },
  keysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginRight: Spacing.md,
  },
  keyBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 3,
  },
  keyText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  orText: {
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  descriptionText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    textAlign: 'right',
  },
  closeButton: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  closeButtonText: {
    fontSize: FontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
});
