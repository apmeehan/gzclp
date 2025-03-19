import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../js/styles';

interface MenuItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  hasNavArrow?: boolean;
  textColor?: string;
}

export default function MenuItem({ 
  title, 
  subtitle, 
  onPress, 
  hasNavArrow = true, 
  textColor 
}: MenuItemProps) {
  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
    >
      <View style={styles.textContainer}>
        <Text style={[
          styles.menuItemText, 
          subtitle ? { marginBottom: 4 } : null,
          textColor ? { color: textColor } : null
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitleText}>{subtitle}</Text>
        )}
      </View>
      {hasNavArrow && (
        <Ionicons name="chevron-forward" size={18} color={colors.mediumGrey} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  textContainer: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  subtitleText: {
    fontSize: 12,
    color: colors.mediumGrey,
    lineHeight: 16,
  },
}); 